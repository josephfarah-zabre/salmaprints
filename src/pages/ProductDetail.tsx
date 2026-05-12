import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { CategoryNavStrip } from "@/components/CategoryNavStrip";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageCircle, ChevronRight, ZoomIn } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { RelatedProducts } from "@/components/RelatedProducts";

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
  const [nextProductId, setNextProductId] = useState<string | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  const fetchNextProduct = async (currentProduct: Product) => {
    if (!currentProduct.category_id) return;
    const { data, error } = await supabase
      .from("products")
      .select("id, display_order")
      .eq("category_id", currentProduct.category_id)
      .order("display_order", { ascending: true });
    if (error || !data || data.length <= 1) return;
    const idx = data.findIndex((p) => p.id === currentProduct.id);
    if (idx === -1) return;
    const nextIdx = (idx + 1) % data.length;
    setNextProductId(data[nextIdx].id);
  };

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
      if (data) fetchNextProduct(data);
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
              <div className="flex flex-col gap-3">
                <div className="relative aspect-square bg-surface-peach/50 rounded-2xl overflow-hidden border border-border group">
                  {product.image_url ? (
                    <>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        onClick={() => setZoomOpen(true)}
                        className="w-full h-full object-contain cursor-zoom-in"
                      />
                      <button
                        type="button"
                        onClick={() => setZoomOpen(true)}
                        aria-label={language === "ar" ? "تكبير الصورة" : "Zoom image"}
                        className="absolute bottom-3 end-3 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary-dark hover:scale-105 transition-all"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-primary/30 text-7xl font-bold">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(-1)}
                    className="flex-1 rounded-full border-primary text-primary hover:bg-primary/10"
                  >
                    <BackIcon className="w-5 h-5 mr-1 rtl:mr-0 rtl:ml-1" />
                    {language === "ar" ? "رجوع" : "Back"}
                  </Button>
                  {nextProductId && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setNextProductId(null);
                        navigate(`/product/${nextProductId}`);
                      }}
                      className="flex-1 rounded-full border-primary text-primary hover:bg-primary/10"
                    >
                      {language === "ar" ? "التالي" : "Next"}
                      <ChevronRight className="w-5 h-5 ml-1 rtl:ml-0 rtl:mr-1" />
                    </Button>
                  )}
                </div>
              </div>


              <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
                <DialogContent className="max-w-5xl w-[95vw] p-2 sm:p-4 bg-background">
                  {product.image_url && (
                    <div className="w-full max-h-[85vh] overflow-auto flex items-center justify-center">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}
                </DialogContent>
              </Dialog>

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
                  className="w-full md:w-auto rounded-full bg-[#00ff4d] hover:bg-[#00e645] text-white mt-2"
                >
                  <MessageCircle className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("product.inquire")}
                </Button>
              </div>
            </div>
          )}

          {product && (
            <RelatedProducts
              productId={product.id}
              subcategoryId={product.subcategory_id}
              categoryId={product.category_id}
            />
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetail;
