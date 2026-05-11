import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Slide {
  id: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  image_url: string | null;
}

const PASTELS = [
  "from-[hsl(var(--surface-blush))] to-[hsl(var(--surface-peach))]",
  "from-[hsl(var(--surface-sky))] to-[hsl(var(--surface-lavender))]",
  "from-[hsl(var(--surface-butter))] to-[hsl(var(--surface-mint))]",
];

export const HeroCarousel = () => {
  const { language } = useLanguage();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: language === "ar" ? "rtl" : "ltr" });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    supabase
      .from("hero_slides")
      .select("id, title_en, title_ar, subtitle_en, subtitle_ar, description_en, description_ar, image_url")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => setSlides((data as Slide[]) || []));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const interval = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, slides.length]);

  const display = slides.length > 0 ? slides : [];

  if (display.length === 0) return null;

  const pickTitle = (s: Slide) => (language === "ar" ? s.title_ar : s.title_en);
  const pickSubtitle = (s: Slide) => (language === "ar" ? s.subtitle_ar : s.subtitle_en);
  const pickDescription = (s: Slide) => (language === "ar" ? s.description_ar : s.description_en);

  return (
    <section className="container mx-auto px-4 mt-4 md:mt-6">
      <div className="relative rounded-3xl overflow-hidden">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {display.map((slide, i) => (
              <div
                key={slide.id}
                className={`relative flex-[0_0_100%] min-w-0 min-h-[280px] max-h-[360px] md:h-[420px] md:max-h-none aspect-[4/3] md:aspect-auto bg-gradient-to-br ${PASTELS[i % PASTELS.length]}`}
              >
                {slide.image_url && (
                  <img
                    src={slide.image_url}
                    alt={pickTitle(slide)}
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                  />
                )}
                <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-2xl">
                  {pickSubtitle(slide) && (
                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary/80 mb-2">
                      {pickSubtitle(slide)}
                    </p>
                  )}
                  <h2
                    className="font-extrabold text-primary leading-tight"
                    style={{ fontSize: "clamp(1.5rem, 6vw, 3.75rem)" }}
                  >
                    {pickTitle(slide)}
                  </h2>
                  {pickDescription(slide) && (
                    <p className="mt-3 text-sm md:text-base text-foreground/80 max-w-md">
                      {pickDescription(slide)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous slide"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white items-center justify-center shadow-md"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next slide"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white items-center justify-center shadow-md"
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm">
          {display.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                selected === i ? "w-6 bg-primary" : "w-2 bg-primary/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
