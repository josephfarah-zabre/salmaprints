
-- Create voting campaigns table
CREATE TABLE public.voting_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voting candidates table (the 5 images/people to vote for)
CREATE TABLE public.voting_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.voting_campaigns(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT,
  vote_count INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table to track individual votes (prevent duplicates)
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.voting_candidates(id) ON DELETE CASCADE NOT NULL,
  voter_identifier TEXT NOT NULL, -- Use session/fingerprint for anonymous voting
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(candidate_id, voter_identifier)
);

-- Enable RLS
ALTER TABLE public.voting_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voting_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Voting campaigns policies
CREATE POLICY "Anyone can view active campaigns" ON public.voting_campaigns
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all campaigns" ON public.voting_campaigns
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert campaigns" ON public.voting_campaigns
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update campaigns" ON public.voting_campaigns
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete campaigns" ON public.voting_campaigns
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Voting candidates policies
CREATE POLICY "Anyone can view candidates of active campaigns" ON public.voting_candidates
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.voting_campaigns 
    WHERE id = campaign_id AND is_active = true
  )
);

CREATE POLICY "Admins can view all candidates" ON public.voting_candidates
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert candidates" ON public.voting_candidates
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update candidates" ON public.voting_candidates
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete candidates" ON public.voting_candidates
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Votes policies
CREATE POLICY "Anyone can insert votes" ON public.votes
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all votes" ON public.votes
FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Create storage bucket for voting images
INSERT INTO storage.buckets (id, name, public) VALUES ('voting-images', 'voting-images', true);

-- Storage policies
CREATE POLICY "Anyone can view voting images" ON storage.objects
FOR SELECT USING (bucket_id = 'voting-images');

CREATE POLICY "Admins can upload voting images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'voting-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update voting images" ON storage.objects
FOR UPDATE USING (bucket_id = 'voting-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete voting images" ON storage.objects
FOR DELETE USING (bucket_id = 'voting-images' AND has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_voting_campaigns_updated_at
BEFORE UPDATE ON public.voting_campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voting_candidates_updated_at
BEFORE UPDATE ON public.voting_candidates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment vote count (atomic operation)
CREATE OR REPLACE FUNCTION public.increment_vote_count(candidate_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.voting_candidates
  SET vote_count = vote_count + 1
  WHERE id = candidate_uuid;
END;
$$;
