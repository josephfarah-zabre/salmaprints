import { ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface PromoTile {
  to: string;
  title: string;
  subtitle: string;
  tone: "blush" | "lavender" | "mint" | "sky" | "butter" | "peach";
}

const TONE_CLASSES: Record<PromoTile["tone"], string> = {
  blush: "bg-surface-blush",
  lavender: "bg-surface-lavender",
  mint: "bg-surface-mint",
  sky: "bg-surface-sky",
  butter: "bg-surface-butter",
  peach: "bg-surface-peach",
};

interface Props {
  tiles: PromoTile[];
}

export const PromoTileRow = ({ tiles }: Props) => {
  const { language } = useLanguage();
  const Arrow = language === "ar" ? ChevronLeft : ChevronRight;
  return (
    <section className="container mx-auto px-4 py-4 md:py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {tiles.map((t) => (
          <Link
            key={t.title}
            to={t.to}
            className={cn(
              "relative rounded-2xl p-5 md:p-6 min-h-[140px] md:min-h-[180px] flex flex-col justify-between overflow-hidden transition-transform hover:-translate-y-0.5",
              TONE_CLASSES[t.tone]
            )}
          >
            <Arrow className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-5 h-5 text-primary/60" />
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold uppercase text-primary leading-tight">
                {t.title}
              </h3>
              <p className="mt-1 text-sm text-foreground/70">{t.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
