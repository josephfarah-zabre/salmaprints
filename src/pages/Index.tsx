import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ExperienceSection } from "@/components/ExperienceSection";
import { MaterialsSection } from "@/components/MaterialsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CategoryCard } from "@/components/CategoryCard";
import Footer from "@/components/Footer";

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

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
        .order("display_order")
        .limit(8);
      
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <WhyChooseUs />

      {/* Categories Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-accent-orange mb-4 tracking-wider">CATEGORIES</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
              EXPLORE OUR CATEGORIES
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  imageUrl={category.image_url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop"}
                  onClick={() => handleCategoryClick(category.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ExperienceSection />
      <MaterialsSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;