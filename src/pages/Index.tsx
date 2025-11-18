import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import Footer from "@/components/Footer";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle2, Clock, Package, Award } from "lucide-react";
import heroImage from "@/assets/hero-background.png";
import aboutImage from "@/assets/about-showroom.jpg";

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category_id: string | null;
  is_featured: boolean | null;
}

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("display_order")
        .limit(6);

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch featured products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(3);

      if (productsError) throw productsError;
      setFeaturedProducts(productsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
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

  const features = [
    {
      title: "Quality Products",
      description: "Premium quality printing and customization services for all your needs",
      icon: <CheckCircle2 className="w-12 h-12 text-white" />,
      variant: "accent" as const
    },
    {
      title: "Fast Service",
      description: "Quick turnaround times without compromising on quality",
      icon: <Clock className="w-12 h-12 text-white" />,
      variant: "secondary" as const
    },
    {
      title: "Wide Range",
      description: "From trophies to t-shirts, we customize everything you need",
      icon: <Package className="w-12 h-12 text-white" />,
      variant: "accent" as const
    },
    {
      title: "Custom Solutions",
      description: "Personalized designs tailored to your specific requirements",
      icon: <Award className="w-12 h-12 text-white" />,
      variant: "secondary" as const
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Top Contact Bar */}
      <div className="bg-gradient-primary text-white py-3 px-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span>📧 info@example.com</span>
            <span>🕐 Sun - Fri (10AM - 10PM)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold">Need Help?</span>
            <a href="tel:+21231234567" className="flex items-center gap-2 hover:underline">
              <Phone className="w-4 h-4" />
              +2 123 654 789
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <Hero
        title="Welcome to Masco Salma Print"
        subtitle="Your One-Stop Shop for Custom Printing & Personalization"
        ctaText="Browse Catalogue"
        onCtaClick={scrollToCatalogue}
        showScrollIndicator={true}
        backgroundImage={heroImage}
      />

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* About Image with Decorative Elements */}
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-accent/10 rounded-lg -z-10"></div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/10 rounded-lg -z-10"></div>
              <img
                src={aboutImage}
                alt="Our Showroom"
                className="rounded-lg shadow-elegant w-full"
              />
              {/* Quality Badge */}
              <div className="absolute bottom-8 left-8 bg-accent text-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl font-bold">10+</div>
                <div className="text-sm">Years Of<br />Quality Service</div>
              </div>
            </div>

            {/* About Content */}
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">
                ABOUT US
              </p>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                We Provide Quality <span className="text-accent">Printing & Customization</span> Services
              </h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                At Masco Salma Print, we specialize in creating personalized products that make your special moments memorable. From custom trophies and awards to personalized clothing and accessories, we bring your vision to life with precision and care.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Wide range of customizable products</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">High-quality materials and printing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Fast turnaround and reliable delivery</span>
                </li>
              </ul>
              <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-base">
                Discover More →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">
                FEATURED PRODUCTS
              </p>
              <h2 className="text-4xl font-bold text-foreground">
                Our <span className="text-accent">Top Picks</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  description={product.description || ""}
                  price={product.price || 0}
                  imageUrl={product.image_url || ""}
                  onWhatsAppClick={() => {
                    const message = `Hi! I'm interested in ${product.name}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  isFeatured={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">
              CATEGORIES
            </p>
            <h2 className="text-4xl font-bold text-foreground">
              Explore Our <span className="text-accent">Collections</span>
            </h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-text-secondary">Loading categories...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    name={category.name}
                    description={category.description}
                    imageUrl={category.image_url || undefined}
                    onClick={() => handleCategoryClick(category.id)}
                  />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button
                  onClick={scrollToCatalogue}
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-base"
                >
                  View All Categories →
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

