import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category_id: string | null;
  subcategory_id: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

const CategoryProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    if (categoryId) {
      setActiveSubcategory("all");
      fetchData();
    }
  }, [categoryId]);

  const fetchData = async () => {
    try {
      const [productsData, categoryData, subcategoriesData] = await Promise.all([
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
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInquiry = (product: Product) => {
    const parts = [
      `Hi! I'm interested in: ${product.name}${product.price ? ` - $${product.price}` : ""}`,
    ];
    if (product.image_url) parts.push(product.image_url);
    const message = encodeURIComponent(parts.join("\n"));
    window.open(`https://wa.me/message/5JHP3PKIIBIRK1?text=${message}`, "_blank");
  };

  const filteredProducts = useMemo(() => {
    if (activeSubcategory === "all") return products;
    return products.filter(p => p.subcategory_id === activeSubcategory);
  }, [products, activeSubcategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Subcategory Filter */}
      {subcategories.length > 0 && (
        <section className="bg-background border-b py-6 px-4 sticky top-0 z-30">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveSubcategory("all")}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold transition-all border",
                  activeSubcategory === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                )}
              >
                All
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubcategory(sub.id)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-semibold transition-all border",
                    activeSubcategory === sub.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                  )}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="flex-1 bg-background py-12 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-text-secondary">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
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
