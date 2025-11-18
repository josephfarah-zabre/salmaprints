import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
              <input
                type="text"
                placeholder="Search furniture..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent-orange shadow-elegant"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
