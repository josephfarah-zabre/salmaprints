import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.png";

export const Hero = () => {
  return (
    <section 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Content */}
      <div className="relative container mx-auto px-4 py-32 text-center z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            Make Your Interior More Minimalistic & Modern
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Turn your room with Panto into a lot more minimalist and modern with ease and speed
          </p>
          
          {/* CTA Button */}
          <Button 
            size="lg"
            className="bg-accent-orange hover:bg-accent-orange/90 text-white text-lg px-10 py-6 h-auto shadow-elegant transition-all duration-300 hover:-translate-y-1"
          >
            Search Furniture
          </Button>
        </div>
      </div>
    </section>
  );
};
