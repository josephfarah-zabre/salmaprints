import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { CategoryNavStrip } from "@/components/CategoryNavStrip";
import Footer from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  subcategory_id: string | null;
  is_featured: boolean | null;
}
interface Subcategory { id: string; name: string; category_id: string; }

const SubcategoryProducts = () => {
  const { subcategoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    if (subcategoryId) fetchData();
  }, [subcategoryId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, subData] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("subcategory_id", subcategoryId)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase.from("subcategories").select("*").eq("id", subcategoryId).single(),
      ]);
      if (productsData.error) throw productsData.error;
      if (subData.error) throw subData.error;
      setProducts(productsData.data || []);
      setSubcategory(subData.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInquiry = (product: Product) => {
    window.open(buildWhatsAppLink(product, language), "_blank", "noopener,noreferrer");
  };

  const BackIcon = language === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CategoryNavStrip />
      <section className="flex-1 px-4 py-6 md:py-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => subcategory && navigate(`/category/${subcategory.category_id}`)}
            >
              <BackIcon className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {language === "ar" ? "رجوع" : "Back"}
            </Button>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-center text-primary mb-6 md:mb-10">
            {subcategory?.name}
          </h1>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-text-secondary py-12">
              {language === "ar" ? "لا توجد منتجات." : "No products found."}
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {products.map((product) => (
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
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SubcategoryProducts;
