import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/logo.jpeg";
import electronicsImg from "@/assets/category-electronics.jpg";
import furnitureImg from "@/assets/category-furniture.jpg";
import clothingImg from "@/assets/category-clothing.jpg";
import homeGardenImg from "@/assets/category-home-garden.jpg";
import Footer from "@/components/Footer";

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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Masco Salma Print
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our categories and discover our products. Contact us on WhatsApp for any inquiries.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group bg-card rounded-lg shadow-sm hover:shadow-hover transition-all duration-300 overflow-hidden border border-border hover:border-primary"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={categoryImages[category.id] || category.image_url || ""}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
