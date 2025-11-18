import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import Footer from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle2, Clock, Settings, DollarSign } from "lucide-react";
import heroImage from "@/assets/hero-car-wash.jpg";
import serviceDetailingImg from "@/assets/service-detailing.jpg";
import serviceExteriorImg from "@/assets/service-exterior.jpg";
import serviceTireImg from "@/assets/service-tire.jpg";
import aboutImage from "@/assets/about-carwash.jpg";

const Index = () => {
  const features = [
    {
      title: "Quality Service",
      description: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      icon: <CheckCircle2 className="w-12 h-12 text-white" />,
      variant: "accent" as const
    },
    {
      title: "Online Booking",
      description: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      icon: <Clock className="w-12 h-12 text-white" />,
      variant: "secondary" as const
    },
    {
      title: "Modern Machines",
      description: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      icon: <Settings className="w-12 h-12 text-white" />,
      variant: "accent" as const
    },
    {
      title: "Affordable Pricing",
      description: "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      icon: <DollarSign className="w-12 h-12 text-white" />,
      variant: "secondary" as const
    }
  ];

  const services = [
    {
      title: "Auto Detailing",
      description: "There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form by injected humour.",
      imageUrl: serviceDetailingImg,
      iconBg: "bg-accent"
    },
    {
      title: "Express Exterior",
      description: "There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form by injected humour.",
      imageUrl: serviceExteriorImg,
      iconBg: "bg-accent"
    },
    {
      title: "Full Tire Wash",
      description: "There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form by injected humour.",
      imageUrl: serviceTireImg,
      iconBg: "bg-accent"
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
            <span className="font-semibold">Need Booking?</span>
            <a href="tel:+21231234567" className="flex items-center gap-2 hover:underline">
              <Phone className="w-4 h-4" />
              +2 123 654 789
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <Hero
        title="We Provide Car Washing Services"
        subtitle="KEEP YOUR CAR CLEAN"
        ctaText="About More"
        onCtaClick={() => {}}
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
                alt="Car Wash Service"
                className="rounded-lg shadow-elegant w-full"
              />
              {/* Quality Badge */}
              <div className="absolute bottom-8 left-8 bg-accent text-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl font-bold">30</div>
                <div className="text-sm">Years Of<br />Quality Service</div>
              </div>
            </div>

            {/* About Content */}
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">
                ABOUT US
              </p>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                We Provide Quality <span className="text-accent">Car Washing</span> Services
              </h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form by injected humour or randomised words which don't look even slightly believable.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">As vero eos et accusamus et iusto odio</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Established fact that a reader will be distracted</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Set up perspiciatis unde omnis iste natus sit</span>
                </li>
              </ul>
              <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-base">
                Discover More →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">
              SERVICES
            </p>
            <h2 className="text-4xl font-bold text-foreground">
              What We <span className="text-accent">Offer</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
