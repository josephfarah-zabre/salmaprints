import { Building2 } from "lucide-react";

export const AboutSection = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image on the left */}
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-elegant animate-fade-in">
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
              alt="About Masco Salma Print"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
          </div>

          {/* Text on the right */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">
                About{" "}
                <span className="relative inline-block">
                  Us
                  <span className="absolute bottom-1 left-0 w-full h-1 bg-primary rounded-full transform -rotate-1"></span>
                </span>
              </h2>
            </div>
            
            <p className="text-lg text-foreground leading-relaxed">
              Welcome to Masco Salma Print, your trusted partner for quality products and exceptional service. 
              We've been serving our customers with dedication and commitment to excellence.
            </p>
            
            <p className="text-base text-muted-foreground leading-relaxed">
              Our mission is to provide you with the best selection of products across multiple categories, 
              from electronics to furniture, clothing, and home & garden essentials. We pride ourselves on 
              our customer-first approach and our commitment to quality.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-primary">500+</h3>
                <p className="text-sm text-muted-foreground">Products Available</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-primary">1000+</h3>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
