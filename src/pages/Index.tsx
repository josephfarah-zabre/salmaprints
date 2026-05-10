import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { CategoryNavStrip } from "@/components/CategoryNavStrip";
import { HeroCarousel } from "@/components/HeroCarousel";
import { RoundCategoryStrip } from "@/components/RoundCategoryStrip";
import { PromoTileRow } from "@/components/PromoTileRow";
import { FeaturedProductsRail } from "@/components/FeaturedProductsRail";
import { CategoryCircle } from "@/components/CategoryCircle";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

interface Subcat {
  id: string;
  name: string;
  category_id: string;
}

interface Cat {
  id: string;
  name: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [topSubs, setTopSubs] = useState<Subcat[]>([]);
  const [topCats, setTopCats] = useState<Cat[]>([]);

  useEffect(() => {
    supabase
      .from("subcategories")
      .select("id, name, category_id")
      .order("display_order")
      .limit(12)
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load subcategories");
        else setTopSubs(data || []);
      });
    supabase
      .from("categories")
      .select("id, name")
      .order("display_order")
      .limit(3)
      .then(({ data }) => setTopCats(data || []));
  }, []);

  // TODO: backend field needed — promo tiles currently link to first 3 categories.
  const tiles = [
    {
      to: topCats[0] ? `/category/${topCats[0].id}` : "/",
      title: language === "ar" ? "عروض مايو" : "May Deals",
      subtitle: language === "ar" ? "صفقات مختارة لك" : "Deals lined up for you",
      tone: "blush" as const,
    },
    {
      to: topCats[1] ? `/category/${topCats[1].id}` : "/",
      title: language === "ar" ? "الأكثر رواجاً" : "Trendy!",
      subtitle: language === "ar" ? "الأكثر طلباً" : "What everyone is choosing",
      tone: "lavender" as const,
    },
    {
      to: topCats[2] ? `/category/${topCats[2].id}` : "/",
      title: language === "ar" ? "تسليم سريع" : "2-Day Delivery",
      subtitle: language === "ar" ? "في كل لبنان" : "All over Lebanon",
      tone: "mint" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CategoryNavStrip />
      <HeroCarousel />
      <RoundCategoryStrip />
      
      <FeaturedProductsRail />

      {topSubs.length > 0 && (
        <section className="container mx-auto px-4 py-8 md:py-12">
          <h2 className="text-xl md:text-2xl font-extrabold text-primary mb-6">
            {language === "ar" ? "تصفّح الأقسام الفرعية" : "Explore Subcategories"}
          </h2>
          <div className="flex md:grid md:grid-cols-6 gap-3 md:gap-6 overflow-x-auto md:overflow-visible no-scrollbar pb-2">
            {topSubs.map((s) => (
              <CategoryCircle
                key={s.id}
                name={s.name}
                size="sm"
                onClick={() => navigate(`/subcategory/${s.id}`)}
                className="shrink-0"
              />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
