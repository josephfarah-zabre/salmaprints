import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category_id: string | null;
}

export const TopSellingProducts = ({ className }: { className?: string }) => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchElectronicsProducts();
  }, []);

  const fetchElectronicsProducts = async () => {
    try {
      // First, get the electronics category
      const { data: categories, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", "%electronic%")
        .limit(1);

      if (categoryError) throw categoryError;

      if (!categories || categories.length === 0) {
        // If no electronics category found, just get the first 6 products
        const { data: allProducts, error: productsError } = await supabase
          .from("products")
          .select("*")
          .limit(6);

        if (productsError) throw productsError;
        setProducts(allProducts || []);
      } else {
        // Get products from electronics category
        const { data: electronicsProducts, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", categories[0].id)
          .limit(6);

        if (productsError) throw productsError;
        setProducts(electronicsProducts || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load top selling products");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInquiry = (product: Product) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in: ${product.name}${product.price ? ` - $${product.price}` : ""}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const scrollLeft = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const scrollRight = () => {
    setCurrentIndex((prev) => Math.min(products.length - 4, prev + 1));
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + 4);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-background-secondary">
        <div className="container mx-auto text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-16 px-4 bg-background-secondary", className)}>
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="relative inline-block">
              {t("topProducts.title")}
              <span className="absolute bottom-1 left-0 w-full h-1 bg-primary rounded-full transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t("topProducts.description")}
          </p>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {products.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollLeft}
                disabled={currentIndex === 0}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-card border-2 border-primary hover:bg-primary-subtle disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollRight}
                disabled={currentIndex >= products.length - 4}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-card border-2 border-primary hover:bg-primary-subtle disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </Button>
            </>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  name={product.name}
                  description={product.description || undefined}
                  price={product.price || undefined}
                  imageUrl={product.image_url || undefined}
                  onWhatsAppClick={() => handleWhatsAppInquiry(product)}
                  isFeatured
                />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button
            onClick={() => window.location.href = "/catalogue"}
            className="bg-gradient-primary hover:opacity-90 px-8 py-3 shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            {t("topProducts.viewAll")}
          </Button>
        </div>
      </div>
    </section>
  );
};
