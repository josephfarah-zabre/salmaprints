import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { CategoryNavStrip } from "@/components/CategoryNavStrip";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category_id: string | null;
  subcategory_id: string | null;
}

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
      if (error) throw error;
      setProduct(data);
    } catch (e) {
      console.error(e);
      toast.error("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    window.open(buildWhatsAppLink(product, language), "_blank", "noopener,noreferrer");
  };

  const BackIcon = language === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CategoryNavStrip />
      <section className="flex-1 px-4 py-6 md:py-10">
        <div className="container mx-auto max-w-5xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <BackIcon className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {language === "ar" ? "رجوع" : "Back"}
          </Button>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            </div>
          ) : !product ? (
            <p className="text-center text-text-secondary py-12">
              {language === "ar" ? "المنتج غير موجود." : "Product not found."}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start">
              <div className="aspect-square bg-surface-peach/50 rounded-2xl overflow-hidden border border-border">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-primary/30 text-7xl font-bold">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-5">
                <h1 className="text-2xl md:text-4xl font-extrabold text-primary">
                  {product.name}
                </h1>
                {product.price != null && (
                  <span className="price text-primary text-4xl md:text-5xl">
                    <span className="currency">$</span>
                    {Number.isInteger(product.price) ? product.price : product.price.toFixed(2)}
                  </span>
                )}
                {product.description && (
                  <p className="text-base text-text-secondary leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                )}
                <Button
                  size="lg"
                  onClick={handleWhatsAppInquiry}
                  className="w-full md:w-auto rounded-full bg-primary hover:bg-primary-dark text-primary-foreground mt-2"
                >
                  <MessageCircle className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("product.inquire")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetail;
