import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
}

const CategoryProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  const fetchData = async () => {
    try {
      const [productsData, categoryData] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("category_id", categoryId)
          .order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("id, name")
          .eq("id", categoryId)
          .single(),
      ]);

      if (productsData.error) throw productsData.error;
      if (categoryData.error) throw categoryData.error;

      setProducts(productsData.data || []);
      setCategory(categoryData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load products");
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Back Button & Category Hero */}
      <section className="bg-gradient-hero py-12 px-4">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          {category && (
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="relative inline-block">
                  {category.name}
                  <span className="absolute bottom-1 left-0 w-full h-1 bg-primary rounded-full transform -rotate-1"></span>
                </span>
              </h1>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="flex-1 bg-background py-12 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-text-secondary">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
                    name={product.name}
                    description={product.description || undefined}
                    price={product.price || undefined}
                    imageUrl={product.image_url || undefined}
                    onWhatsAppClick={() => handleWhatsAppInquiry(product)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryProducts;

