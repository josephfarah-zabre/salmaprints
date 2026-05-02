import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SlidingBanner } from "@/components/SlidingBanner";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ExperienceSection } from "@/components/ExperienceSection";
import { MaterialsSection } from "@/components/MaterialsSection";
import { CategoryCard } from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { PromoPopup } from "@/components/PromoPopup";
import { VotingPopup } from "@/components/VotingPopup";

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface PromoPopupData {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

interface VotingCampaign {
  id: string;
  title: string;
  description: string | null;
  end_date: string;
}

interface VotingCandidate {
  id: string;
  name: string;
  image_url: string | null;
  vote_count: number;
}

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoPopup, setPromoPopup] = useState<PromoPopupData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [votingCampaign, setVotingCampaign] = useState<VotingCampaign | null>(null);
  const [votingCandidates, setVotingCandidates] = useState<VotingCandidate[]>([]);
  const [showVotingPopup, setShowVotingPopup] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  useEffect(() => {
    fetchCategories();
    fetchVotingCampaign();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order")
        .limit(12);
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchVotingCampaign = async () => {
    try {
      // Check if user already dismissed voting popup in this session
      const dismissed = sessionStorage.getItem("voting-popup-dismissed");
      if (dismissed) {
        // If voting was dismissed, check for promo popup
        fetchPromoPopup();
        return;
      }

      const { data: campaignData, error: campaignError } = await supabase
        .from("voting_campaigns")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (campaignError) throw campaignError;

      if (campaignData) {
        // Check if campaign hasn't ended
        if (new Date(campaignData.end_date) > new Date()) {
          const { data: candidatesData, error: candidatesError } = await supabase
            .from("voting_candidates")
            .select("*")
            .eq("campaign_id", campaignData.id)
            .order("display_order");

          if (candidatesError) throw candidatesError;

          if (candidatesData && candidatesData.length > 0) {
            setVotingCampaign(campaignData);
            setVotingCandidates(candidatesData);
            setShowVotingPopup(true);
            return;
          }
        }
      }

      // No active voting campaign, check for promo popup
      fetchPromoPopup();
    } catch (error) {
      console.error("Error fetching voting campaign:", error);
      fetchPromoPopup();
    }
  };

  const fetchPromoPopup = async () => {
    try {
      const dismissed = sessionStorage.getItem("promo-popup-dismissed");
      if (dismissed) return;

      const { data, error } = await supabase
        .from("promotional_popups")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setPromoPopup(data);
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error fetching promo popup:", error);
    }
  };

  const handleVotingPopupClose = () => {
    setShowVotingPopup(false);
    // After voting popup closes, show promo popup if available
    fetchPromoPopup();
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      {/* Voting Popup - shown first */}
      {showVotingPopup && votingCampaign && votingCandidates.length > 0 && (
        <VotingPopup
          campaign={votingCampaign}
          candidates={votingCandidates}
          onClose={handleVotingPopupClose}
        />
      )}

      {/* Promo Popup - shown after voting popup is dismissed */}
      {showPopup && promoPopup && (
        <PromoPopup
          title={promoPopup.title}
          subtitle={promoPopup.subtitle || undefined}
          description={promoPopup.description || undefined}
          imageUrl={promoPopup.image_url || undefined}
          onClose={() => setShowPopup(false)}
        />
      )}

      <SlidingBanner />

      {/* Categories Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-accent-orange mb-4 tracking-wider">{t("categories.label")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
              {t("categories.title")}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map(category => (
                  <CategoryCard
                    key={category.id}
                    name={category.name}
                    imageUrl={category.image_url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop"}
                    onClick={() => handleCategoryClick(category.id)}
                  />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <button
                  onClick={() => navigate('/catalogue')}
                  className="px-8 py-3 bg-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors text-primary-foreground"
                >
                  {t("categories.explore")}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <ExperienceSection />
      <MaterialsSection />
      
      <Footer />
    </div>
  );
};

export default Index;