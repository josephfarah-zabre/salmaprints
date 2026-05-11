import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  name: string;
  price: number | null;
  image_url: string | null;
}

export const FeaturedProductsRail = () => {
  const [items, setItems] = useState<Product[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    supabase
      .from("products")
      .select("id, name, price, image_url")
      .eq("is_featured", true)
      .order("display_order")
      .limit(12)
      .then(({ data }) => setItems(data || []));
  }, []);

  if (!items.length) return null;

  return (
    <section className="container mx-auto px-4 py-6 md:py-10">
      <div className="rounded-2xl bg-surface-butter/60 p-4 md:p-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-primary">
              {language === "ar" ? "وصل حديثاً" : "What's New"}
            </h2>
            <p className="text-xs md:text-sm text-foreground/60">
              {language === "ar" ? "كن أول من يطلب" : "Be the first to shop"}
            </p>
          </div>
          <Link to="/" className="text-sm font-semibold text-primary hover:underline">
            {language === "ar" ? "عرض الكل ←" : "View More →"}
          </Link>
        </div>
        <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-1">
          {items.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="shrink-0 w-16 md:w-20 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="aspect-square bg-secondary flex items-center justify-center">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base font-bold text-primary/30">{p.name.charAt(0)}</span>
                )}
              </div>
              <div className="px-1.5 py-1 text-center">
                {p.price ? (
                  <span className="price text-primary text-xs">
                    <span className="currency">$</span>
                    {Math.round(p.price)}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-foreground/60 line-clamp-1">{p.name}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
