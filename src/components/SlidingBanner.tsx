import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
interface SlidingBannerProps {
  className?: string;
}
export const SlidingBanner = ({
  className
}: SlidingBannerProps) => {
  const {
    t
  } = useLanguage();
  const bannerText = t("banner.text");
  return <div className={cn("bg-secondary text-secondary-foreground border-b border-border py-1.5 overflow-hidden", className)}>
      <div className="flex animate-slide-banner whitespace-nowrap">
        <div className="flex items-center gap-12 px-6">
          {[...Array(4)].map((_, i) => <span key={i} className="text-xs font-medium tracking-wide text-muted-foreground">
              {bannerText}
            </span>)}
        </div>
      </div>
    </div>;
};