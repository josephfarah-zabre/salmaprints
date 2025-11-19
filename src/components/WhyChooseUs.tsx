import { Clock, Palette, Shield } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Quick production and delivery times to meet your deadlines. Most orders completed within 3-5 business days with rush options available."
  },
  {
    icon: Palette,
    title: "Custom Design Support",
    description: "Our design team provides free assistance to bring your vision to life. From simple logos to complex artwork, we've got you covered."
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "We use premium materials and state-of-the-art printing technology. 100% satisfaction guaranteed or we'll make it right."
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#D47B9B' }}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-white/20">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-white mb-4 leading-relaxed">{feature.description}</p>
              <a href="#" className="text-white hover:underline font-medium">
                More Info →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
