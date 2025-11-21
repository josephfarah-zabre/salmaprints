import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  {
    name: "Sarah M.",
    text: "Amazing quality on our custom t-shirts! The prints are vibrant and haven't faded after multiple washes. Fast delivery too!"
  },
  {
    name: "Ahmed K.",
    text: "Ordered business cards and promotional mugs for our company event. The team helped with the design and the results were perfect!"
  },
  {
    name: "Fatima R.",
    text: "Best printing service in town! Quick turnaround time and the custom design support really helped bring my vision to life."
  },
  {
    name: "Omar S.",
    text: "Excellent quality prints and very professional service. We've been ordering all our promotional items from them. Highly recommended!"
  }
];

export const TestimonialsSection = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-4 bg-primary">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-foreground mb-4 tracking-wider">{t("testimonials.label")}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            {t("testimonials.title")}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background p-6 rounded-lg shadow-card hover:shadow-hover transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent-yellow text-accent-yellow" />
                ))}
              </div>
              <h4 className="font-semibold text-foreground mb-3">{testimonial.name}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
