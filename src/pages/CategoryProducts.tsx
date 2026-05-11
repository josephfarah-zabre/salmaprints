import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCircle } from "@/components/CategoryCircle";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { CategoryNavStrip } from "@/components/CategoryNavStrip";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  is_featured: boolean | null;
}

interface Category { id: string; name: string; }
interface Subcategory { id: string; name: string; category_id: string; }

const CategoryProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { language } = useLanguage();

  useEffect(() => {
    if (categoryId) fetchData();
  }, [categoryId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoryData, subcategoriesData] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("category_id", categoryId)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("id, name").eq("id", categoryId).single(),
        supabase
          .from("subcategories")
          .select("id, name, category_id")
          .eq("category_id", categoryId)
          .order("display_order"),
      ]);
      if (productsData.error) throw productsData.error;
      if (categoryData.error) throw categoryData.error;
      if (subcategoriesData.error) throw subcategoriesData.error;
      setProducts(productsData.data || []);
      setCategory(categoryData.data);
      setSubcategories(subcategoriesData.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const hasSubcategories = subcategories.length > 0;
  const productsWithoutSub = products.filter((p) => !p.subcategory_id);

  const handleWhatsAppInquiry = (product: Product) => {
    window.open(buildWhatsAppLink(product, language), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CategoryNavStrip />

      <section className="flex-1 px-4 py-6 md:py-10">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-4xl font-extrabold text-center text-primary mb-6 md:mb-10">
            {category?.name}
          </h1>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            </div>
          ) : (
            <>
              {hasSubcategories && (
                <div className="flex md:grid md:grid-cols-6 gap-3 md:gap-6 overflow-x-auto md:overflow-visible no-scrollbar pb-2 mb-8">
                  {subcategories.map((sub) => {
                    const img = products.find((p) => p.subcategory_id === sub.id)?.image_url || undefined;
                    return (
                      <CategoryCircle
                        key={sub.id}
                        name={sub.name}
                        imageUrl={img}
                        size="sm"
                        onClick={() => navigate(`/subcategory/${sub.id}`)}
                        className="shrink-0"
                      />
                    );
                  })}
                </div>
              )}

              {(!hasSubcategories ? products : productsWithoutSub).length > 0 && (
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {(!hasSubcategories ? products : productsWithoutSub).map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      description={product.description || undefined}
                      price={product.price ?? undefined}
                      imageUrl={product.image_url || undefined}
                      isFeatured={!!product.is_featured}
                      onWhatsAppClick={() => handleWhatsAppInquiry(product)}
                    />
                  ))}
                </div>
              )}

              {!hasSubcategories && products.length === 0 && (
                <p className="text-center text-text-secondary py-12">
                  {language === "ar" ? "لا توجد منتجات." : "No products found."}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryProducts;
