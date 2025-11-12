import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

const Catalogue = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("id, name").order("display_order"),
      ]);

      if (productsData.error) throw productsData.error;
      if (categoriesData.error) throw categoriesData.error;

      setProducts(productsData.data || []);
      setCategories(categoriesData.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const handleWhatsAppInquiry = (product: Product) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in: ${product.name}${product.price ? ` - $${product.price}` : ""}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card shadow-sm sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Product Catalogue
            </h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/login")}>
            Admin
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Discover Our Products
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our carefully curated collection. Contact us on WhatsApp for any inquiries.
        </p>
      </section>

      {/* Category Filter */}
      <div className="container mx-auto px-4">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
    </div>
  );
};

export default Catalogue;