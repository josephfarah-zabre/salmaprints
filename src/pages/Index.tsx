import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import electronicsImg from "@/assets/category-electronics.jpg";
import furnitureImg from "@/assets/category-furniture.jpg";
import clothingImg from "@/assets/category-clothing.jpg";
import homeGardenImg from "@/assets/category-home-garden.jpg";

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

const categoryImages: Record<string, string> = {
  "acd79acf-30b3-4dcf-aeef-480a4282a7b1": electronicsImg,
  "6699bccd-9085-4fbf-b09b-b16212eaeab2": furnitureImg,
  "c916050c-c7e9-45a9-8048-223849e6b51c": clothingImg,
  "4c7f2eff-be45-4187-ad81-dda485e7736f": homeGardenImg,
};

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const scrollToCatalogue = () => {
    navigate("/catalogue");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <Hero
        title="Welcome to Masco Salma Print"
        subtitle="Browse our categories and discover our products. Contact us on WhatsApp for any inquiries."
        ctaText="Browse Catalogue"
        onCtaClick={scrollToCatalogue}
      />

      {/* Categories Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our{" "}
              <span className="relative inline-block">
                Categories
                <span className="absolute bottom-1 left-0 w-full h-1 bg-primary rounded-full transform -rotate-1"></span>
              </span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Discover our wide range of products organized by category
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-text-secondary">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">No categories found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CategoryCard
                    name={category.name}
                    description={category.description || undefined}
                    imageUrl={categoryImages[category.id] || category.image_url || undefined}
                    onClick={() => handleCategoryClick(category.id)}
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

export default Index;

