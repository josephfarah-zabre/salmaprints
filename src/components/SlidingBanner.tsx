import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface SlidingBannerProps {
  className?: string;
}

export const SlidingBanner = ({ className }: SlidingBannerProps) => {
  const { language, t } = useLanguage();
  const [text, setText] = useState<string>(t("banner.text"));

  useEffect(() => {
    let active = true;
    supabase
      .from("site_settings")
      .select("banner_text_en, banner_text_ar")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!active || !data) return;
        const dbText = language === "ar" ? data.banner_text_ar : data.banner_text_en;
        if (dbText) setText(dbText);
      });
    return () => {
      active = false;
    };
  }, [language]);

  return (
    <div
      className={cn(
        "bg-secondary text-secondary-foreground border-b border-border py-1.5 overflow-hidden bg-red-700",
        className
      )}
    >
      <div className="flex animate-slide-banner whitespace-nowrap">
        <div className="flex items-center gap-12 px-6">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-xs font-medium tracking-wide text-muted-foreground"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
