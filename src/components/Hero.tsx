import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  onCtaClick?: () => void;
  showScrollIndicator?: boolean;
}

export const Hero = ({ 
  title, 
  subtitle, 
  ctaText = "Browse Catalogue", 
  onCtaClick,
  showScrollIndicator = true 
}: HeroProps) => {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight * 0.8, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[80vh] md:min-h-[80vh] flex items-center justify-center bg-gradient-hero px-4 py-16">
      <div className="container mx-auto text-center animate-fade-in">
        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="relative inline-block">
            {title}
            <span className="absolute bottom-2 left-0 w-full h-1 bg-primary rounded-full transform -rotate-1"></span>
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto mb-10">
          {subtitle}
        </p>
        
        {/* CTA Button */}
        {onCtaClick && (
          <Button 
            onClick={onCtaClick}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 h-auto shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
          >
            {ctaText}
          </Button>
        )}
      </div>
      
      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary animate-bounce hover:text-primary-secondary transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      )}
    </section>
  );
};
