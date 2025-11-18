import { Package, DollarSign, Grid3x3 } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Luxury facilities",
    description: "The advantage of hiring a workspace with us is that gives you comfortable service and all-around facilities."
  },
  {
    icon: DollarSign,
    title: "Affordable Price",
    description: "You can get a workspace of the highest quality at an affordable price and still enjoy the facilities that are only here."
  },
  {
    icon: Grid3x3,
    title: "Many Choices",
    description: "We provide many unique work space choices so that you can choose the workspace to your liking."
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">{feature.description}</p>
              <a href="#" className="text-accent-orange hover:underline font-medium">
                More Info →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
