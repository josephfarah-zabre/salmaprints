import { cn } from "@/lib/utils";

interface SlidingBannerProps {
  className?: string;
}

export const SlidingBanner = ({ className }: SlidingBannerProps) => {
  const bannerText = "Everything You Need for Your Business • Quality Products at Great Prices • Fast & Reliable Service • Wide Range of Categories • Contact Us on WhatsApp";
  
  return (
    <div className={cn("bg-primary text-foreground py-4 overflow-hidden", className)}>
      <div className="flex animate-slide-banner whitespace-nowrap">
        <div className="flex items-center space-x-8 px-4">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-lg font-semibold">
              {bannerText}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
