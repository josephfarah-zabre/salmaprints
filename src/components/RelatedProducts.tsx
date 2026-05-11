import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface Related {
  id: string;
  name: string;
  price: number | null;
  image_url: string | null;
}

interface Props {
  productId: string;
  subcategoryId: string | null;
  categoryId: string | null;
}

export const RelatedProducts = ({ productId, subcategoryId, categoryId }: Props) => {
  const { language } = useLanguage();
  const [items, setItems] = useState<Related[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const fetchBy = async (col: "subcategory_id" | "category_id", val: string) => {
        const { data } = await supabase
          .from("products")
          .select("id, name, price, image_url")
          .eq(col, val)
          .neq("id", productId)
          .order("display_order")
          .limit(3);
        return data || [];
      };

      let list: Related[] = [];
      if (subcategoryId) list = await fetchBy("subcategory_id", subcategoryId);
      if (list.length < 3 && categoryId) {
        const more = await fetchBy("category_id", categoryId);
        const seen = new Set(list.map((p) => p.id));
        for (const p of more) {
          if (list.length >= 3) break;
          if (!seen.has(p.id)) list.push(p);
        }
      }
      if (active) setItems(list.slice(0, 3));
    })();
    return () => {
      active = false;
    };
  }, [productId, subcategoryId, categoryId]);

  if (!items.length) return null;

  return (
    <div className="mt-10 md:mt-14">
      <h2 className="text-lg md:text-2xl font-extrabold text-primary mb-4 md:mb-6">
        {language === "ar" ? "منتجات ذات صلة" : "Related Products"}
      </h2>
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="group bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all"
          >
            <div className="aspect-square bg-secondary overflow-hidden">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary/30">
                    {p.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="px-2 py-2 text-center">
              <p className="text-[11px] md:text-sm font-semibold line-clamp-1">
                {p.name}
              </p>
              {p.price != null && (
                <span className="price text-primary text-sm md:text-lg">
                  <span className="currency">$</span>
                  {Number.isInteger(p.price) ? p.price : p.price.toFixed(2)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
