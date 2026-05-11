import { useEffect, useState } from "react";
import { Trophy, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface Campaign {
  id: string;
  title: string;
  end_date: string;
}

const useCountdown = (endDate: string) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, new Date(endDate).getTime() - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
    ended: diff === 0,
  };
};

export const VoteCTABanner = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("voting_campaigns")
        .select("id, title, end_date")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);
      const c = data?.[0];
      if (!active || !c) return;
      if (new Date(c.end_date).getTime() < Date.now()) return;
      setCampaign(c);
    })();
    return () => {
      active = false;
    };
  }, []);

  const cd = useCountdown(campaign?.end_date || new Date().toISOString());

  if (!campaign || cd.ended) return null;

  const open = () => {
    sessionStorage.removeItem(`vote_dismissed_${campaign.id}`);
    window.dispatchEvent(new Event("open-voting-popup"));
  };

  return (
    <section className="container mx-auto px-4 py-4 md:py-6">
      <button
        onClick={open}
        dir={isAr ? "rtl" : "ltr"}
        className="group w-full flex items-center justify-between gap-3 md:gap-6 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white px-4 md:px-6 py-3 md:py-4 shadow-elegant hover:shadow-lg transition-all hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0 text-left rtl:text-right">
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80">
              {isAr ? "تصويت مباشر" : "Live Vote"}
            </div>
            <div className="font-extrabold text-sm md:text-lg truncate">
              {campaign.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5">
            {[
              { l: isAr ? "ي" : "D", v: cd.d },
              { l: isAr ? "س" : "H", v: cd.h },
              { l: isAr ? "د" : "M", v: cd.m },
              { l: isAr ? "ث" : "S", v: cd.s },
            ].map((u, i) => (
              <div
                key={i}
                className="px-2 py-1 rounded-md bg-white/15 backdrop-blur text-center min-w-[34px]"
              >
                <div className="text-sm font-extrabold tabular-nums leading-none">
                  {String(u.v).padStart(2, "0")}
                </div>
                <div className="text-[9px] uppercase opacity-80 mt-0.5">{u.l}</div>
              </div>
            ))}
          </div>
          <span className="hidden md:inline-flex items-center gap-1 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {isAr ? "صوّت الآن" : "Vote Now"}
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="md:hidden inline-flex items-center gap-0.5 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {isAr ? "صوّت" : "Vote"}
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </span>
        </div>
      </button>
    </section>
  );
};
