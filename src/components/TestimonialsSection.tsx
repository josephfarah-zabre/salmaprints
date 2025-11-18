import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Bang Jakub",
    text: "I really like it when I sit on this chair, it is very comfortable and the design is very modern."
  },
  {
    name: "Jakub Josh",
    text: "The quality is superb and the price is very affordable. Highly recommend for anyone looking for furniture."
  },
  {
    name: "Jakub John",
    text: "Beautiful design and great materials. The delivery was fast and the customer service was excellent."
  },
  {
    name: "Jakub Jane",
    text: "Best furniture shopping experience I've had. The products exceeded my expectations in every way."
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-background-cream">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-accent-orange mb-4 tracking-wider">REVIEWS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            WHAT OUR CUSTOMERS SAY ABOUT US
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
