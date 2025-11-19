import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([supabase.from("products").select("*").order("created_at", {
        ascending: false
      }), supabase.from("categories").select("id, name").order("display_order")]);
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
  const filteredProducts = selectedCategory ? products.filter(p => p.category_id === selectedCategory) : products;
  const handleWhatsAppInquiry = (product: Product) => {
    const message = encodeURIComponent(`Hi! I'm interested in: ${product.name}${product.price ? ` - $${product.price}` : ""}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };
  return <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 px-4">
        <div className="container mx-auto text-center animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-slate-50 md:text-7xl">
            Discover Our{" "}
            <span className="relative inline-block">
              Products
              <span className="absolute bottom-1 left-0 w-full h-1 bg-primary rounded-full transform -rotate-1"></span>
            </span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Browse our carefully curated collection. Contact us on WhatsApp for any inquiries.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-background py-8 px-4">
        <div className="container mx-auto">
          <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        </div>
      </section>

      {/* Products Grid */}
      <section className="flex-1 bg-background py-8 px-4">
        <div className="container mx-auto">
          {loading ? <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-text-secondary">Loading products...</p>
            </div> : filteredProducts.length === 0 ? <div className="text-center py-12">
              <p className="text-text-secondary">No products found.</p>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => <div key={product.id} className="animate-slide-up" style={{
            animationDelay: `${index * 50}ms`
          }}>
                  <ProductCard name={product.name} description={product.description || undefined} price={product.price || undefined} imageUrl={product.image_url || undefined} onWhatsAppClick={() => handleWhatsAppInquiry(product)} />
                </div>)}
            </div>}
        </div>
      </section>

      <Footer />
    </div>;
};
export default Catalogue;