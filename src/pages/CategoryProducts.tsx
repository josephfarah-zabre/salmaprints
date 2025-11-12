import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/logo.jpeg";
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
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="bg-card shadow-sm sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center">
            <img src={logo} alt="Masco Salma Print" className="h-16 md:h-20 object-contain" />
          </div>
        </div>
      </header>

      {/* Back Button & Category Title */}
      <section className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>
        {category && (
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {category.name}
          </h2>
        )}
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                description={product.description || undefined}
                price={product.price || undefined}
                imageUrl={product.image_url || undefined}
                onWhatsAppClick={() => handleWhatsAppInquiry(product)}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default CategoryProducts;
