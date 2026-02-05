import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VotingCandidate {
  id: string;
  name: string;
  image_url: string | null;
  vote_count: number;
}

interface VotingCampaign {
  id: string;
  title: string;
  description: string | null;
  end_date: string;
}

interface VotingPopupProps {
  campaign: VotingCampaign;
  candidates: VotingCandidate[];
  onClose: () => void;
}

export const VotingPopup = ({ campaign, candidates, onClose }: VotingPopupProps) => {
  const [open, setOpen] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Generate a unique voter identifier
  const getVoterIdentifier = () => {
    let identifier = localStorage.getItem("voter-identifier");
    if (!identifier) {
      identifier = `voter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("voter-identifier", identifier);
    }
    return identifier;
  };

  // Check if user already voted
  useEffect(() => {
    const checkVoted = () => {
      const votedCampaigns = JSON.parse(localStorage.getItem("voted-campaigns") || "[]");
      if (votedCampaigns.includes(campaign.id)) {
        setHasVoted(true);
      }
    };
    checkVoted();
  }, [campaign.id]);

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date(campaign.end_date).getTime();
      const now = new Date().getTime();
      const difference = endDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [campaign.end_date]);

  const handleVote = async () => {
    if (!selectedCandidate || hasVoted) return;

    setIsSubmitting(true);
    try {
      const voterIdentifier = getVoterIdentifier();

      // Insert vote
      const { error: voteError } = await supabase
        .from("votes")
        .insert({ candidate_id: selectedCandidate, voter_identifier: voterIdentifier });

      if (voteError) {
        if (voteError.code === "23505") {
          toast.error("You have already voted!");
        } else {
          throw voteError;
        }
        return;
      }

      // Increment vote count
      const { error: incrementError } = await supabase.rpc("increment_vote_count", {
        candidate_uuid: selectedCandidate,
      });

      if (incrementError) throw incrementError;

      // Mark as voted locally
      const votedCampaigns = JSON.parse(localStorage.getItem("voted-campaigns") || "[]");
      votedCampaigns.push(campaign.id);
      localStorage.setItem("voted-campaigns", JSON.stringify(votedCampaigns));

      setHasVoted(true);
      toast.success("Thank you for voting!");
      
      // Close after short delay
      setTimeout(() => handleClose(), 1500);
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("voting-popup-dismissed", "true");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{campaign.title}</h2>
            {campaign.description && (
              <p className="text-muted-foreground">{campaign.description}</p>
            )}
          </div>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4">
            <div className="flex flex-col items-center bg-primary/10 rounded-lg p-3 min-w-[60px]">
              <span className="text-2xl font-bold text-primary">{timeLeft.days}</span>
              <span className="text-xs text-muted-foreground">Days</span>
            </div>
            <div className="flex flex-col items-center bg-primary/10 rounded-lg p-3 min-w-[60px]">
              <span className="text-2xl font-bold text-primary">{timeLeft.hours}</span>
              <span className="text-xs text-muted-foreground">Hours</span>
            </div>
            <div className="flex flex-col items-center bg-primary/10 rounded-lg p-3 min-w-[60px]">
              <span className="text-2xl font-bold text-primary">{timeLeft.minutes}</span>
              <span className="text-xs text-muted-foreground">Minutes</span>
            </div>
            <div className="flex flex-col items-center bg-primary/10 rounded-lg p-3 min-w-[60px]">
              <span className="text-2xl font-bold text-primary">{timeLeft.seconds}</span>
              <span className="text-xs text-muted-foreground">Seconds</span>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {candidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => !hasVoted && setSelectedCandidate(candidate.id)}
                disabled={hasVoted}
                className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedCandidate === candidate.id
                    ? "border-primary ring-2 ring-primary/50 scale-105"
                    : "border-border hover:border-primary/50"
                } ${hasVoted ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="aspect-square bg-muted">
                  {candidate.image_url ? (
                    <img
                      src={candidate.image_url}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-2 text-center bg-background">
                  <p className="text-sm font-medium truncate">{candidate.name}</p>
                </div>
                {selectedCandidate === candidate.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Vote Button */}
          <div className="text-center">
            {hasVoted ? (
              <p className="text-green-600 font-semibold">Thank you for voting! 🎉</p>
            ) : (
              <button
                onClick={handleVote}
                disabled={!selectedCandidate || isSubmitting}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Vote Now"}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
