import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] bg-primary flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="relative container mx-auto px-4 py-32 text-center z-10">
        <div className="max-w-4xl mx-auto">
          {/* Floating Objects Circle - Placeholder for now */}
          <div className="mb-12 relative h-64 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=300&h=400&fit=crop" 
              alt="Hero character"
              className="h-64 w-auto object-cover rounded-full shadow-elegant"
            />
          </div>
          
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
