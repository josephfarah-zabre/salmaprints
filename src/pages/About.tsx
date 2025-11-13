import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Target, Award, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const coreValues = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above all else, building lasting relationships through exceptional service.",
    },
    {
      icon: Target,
      title: "Quality Excellence",
      description: "Every product in our catalog meets rigorous quality standards, ensuring you receive only the best.",
    },
    {
      icon: Award,
      title: "Innovation",
      description: "We continuously seek new ways to improve our offerings and stay ahead of market trends.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a strong community around our brand, fostering connections between customers and our team.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20 px-4">
          <div className="container mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About{" "}
              <span className="relative inline-block">
                Masco Salma Print
                <span className="absolute bottom-2 left-0 w-full h-1 bg-primary rounded-full transform -rotate-1"></span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
              Your trusted partner for quality products and exceptional service
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    Founded with a vision to provide exceptional products and services, 
                    Masco Salma Print has grown into a trusted name in the industry. Our 
                    journey began with a simple mission: to make quality products accessible 
                    to everyone.
                  </p>
                  <p>
                    Over the years, we've built strong relationships with our customers and 
                    suppliers, always maintaining our commitment to excellence. Every product 
                    in our catalog is carefully selected to meet our high standards.
                  </p>
                  <p className="text-primary font-semibold text-lg">
                    "Quality is not an act, it is a habit." - This philosophy guides everything we do.
                  </p>
                </div>
              </div>
              <div className="animate-slide-up">
                <div className="aspect-square rounded-lg overflow-hidden shadow-elegant">
                  <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                    <Users className="w-32 h-32 text-primary-foreground opacity-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 px-4 bg-background-tertiary">
          <div className="container mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                The principles that guide our business and shape our relationships
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <Card
                  key={index}
                  className="border-2 border-border hover:border-primary hover:shadow-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-subtle flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-text-secondary">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <Card className="border-2 border-primary bg-primary-subtle/30 shadow-elegant">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                  Our Mission
                </h2>
                <p className="text-lg md:text-xl text-text-primary max-w-3xl mx-auto leading-relaxed">
                  To provide our customers with the highest quality products and exceptional 
                  service, while building lasting relationships based on trust, integrity, and 
                  mutual respect. We strive to exceed expectations in everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 px-4 bg-gradient-hero">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Have questions or want to learn more about our products? We'd love to hear from you!
            </p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-8 py-4 rounded-md font-semibold hover:opacity-90 transition-all duration-300 hover:-translate-y-1 shadow-elegant hover:shadow-glow"
            >
              Contact Us on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
