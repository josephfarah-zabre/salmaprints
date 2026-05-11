import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Trophy, Check } from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  end_date: string;
}

interface Candidate {
  id: string;
  name: string;
  image_url: string | null;
  vote_count: number;
}

const VOTER_KEY = "voter_identifier";
const getVoterId = () => {
  let id = localStorage.getItem(VOTER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTER_KEY, id);
  }
  return id;
};

const useCountdown = (endDate: string) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, new Date(endDate).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s, ended: diff === 0 };
};

export const VotingPopup = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [open, setOpen] = useState(false);
  const [voted, setVoted] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: camps } = await supabase
        .from("voting_campaigns")
        .select("id, title, description, end_date")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);
      const c = camps?.[0];
      if (!c) return;
      if (new Date(c.end_date).getTime() < Date.now()) return;

      const dismissedKey = `vote_dismissed_${c.id}`;
      if (sessionStorage.getItem(dismissedKey)) return;

      const votedKey = `voted_${c.id}`;
      const prev = localStorage.getItem(votedKey);
      if (prev) setVoted(prev);

      const { data: cands } = await supabase
        .from("voting_candidates")
        .select("id, name, image_url, vote_count")
        .eq("campaign_id", c.id)
        .order("display_order");

      setCampaign(c);
      setCandidates(cands || []);
      setTimeout(() => setOpen(true), 800);
    })();
  }, []);

  const cd = useCountdown(campaign?.end_date || new Date().toISOString());

  const handleVote = async (candidateId: string) => {
    if (!campaign || voted) return;
    setSubmitting(candidateId);
    try {
      const voter = getVoterId();
      const { error } = await supabase
        .from("votes")
        .insert({ candidate_id: candidateId, voter_identifier: voter });
      if (error) throw error;
      await supabase.rpc("increment_vote_count", { candidate_uuid: candidateId });
      localStorage.setItem(`voted_${campaign.id}`, candidateId);
      setVoted(candidateId);
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, vote_count: c.vote_count + 1 } : c))
      );
      toast.success(isAr ? "تم تسجيل صوتك!" : "Vote recorded!");
    } catch (e: any) {
      toast.error(isAr ? "فشل التصويت" : "Vote failed");
    } finally {
      setSubmitting(null);
    }
  };

  const close = () => {
    if (campaign) sessionStorage.setItem(`vote_dismissed_${campaign.id}`, "1");
    setOpen(false);
  };

  if (!open || !campaign) return null;

  const totalVotes = candidates.reduce((s, c) => s + c.vote_count, 0);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={close}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div
        className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              {isAr ? "صوّت الآن" : "Vote Now"}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
            {campaign.title}
          </h2>
          {campaign.description && (
            <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
          )}

          {/* Countdown */}
          {!cd.ended && (
            <div className="flex gap-2 mb-6">
              {[
                { label: isAr ? "يوم" : "D", v: cd.d },
                { label: isAr ? "س" : "H", v: cd.h },
                { label: isAr ? "د" : "M", v: cd.m },
                { label: isAr ? "ث" : "S", v: cd.s },
              ].map((u, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/5 rounded-lg px-2 py-2 text-center"
                >
                  <div className="text-lg md:text-xl font-extrabold text-primary tabular-nums">
                    {String(u.v).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] uppercase text-muted-foreground">{u.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Candidates */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {candidates.map((c) => {
              const isVoted = voted === c.id;
              const pct = totalVotes ? Math.round((c.vote_count / totalVotes) * 100) : 0;
              return (
                <div
                  key={c.id}
                  className={`rounded-xl border-2 overflow-hidden transition-all ${
                    isVoted ? "border-accent" : "border-border"
                  }`}
                >
                  <div className="aspect-square bg-muted relative">
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        {isAr ? "لا توجد صورة" : "No image"}
                      </div>
                    )}
                    {isVoted && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-semibold text-sm text-center truncate">{c.name}</p>
                    {voted ? (
                      <div className="mt-2">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-center mt-1 text-muted-foreground">
                          {c.vote_count} {isAr ? "صوت" : "votes"} · {pct}%
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleVote(c.id)}
                        disabled={!!submitting || cd.ended}
                        className="mt-2 w-full text-xs font-bold py-1.5 rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                      >
                        {submitting === c.id
                          ? "..."
                          : cd.ended
                          ? isAr
                            ? "انتهى"
                            : "Ended"
                          : isAr
                          ? "صوّت"
                          : "Vote"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {voted && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {isAr ? "شكراً على تصويتك!" : "Thanks for voting!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
