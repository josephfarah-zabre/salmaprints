export const MaterialsSection = () => {
  const images = [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&h=300&fit=crop"
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold text-accent-orange mb-4 tracking-wider">MATERIALS</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground leading-tight">
              Very Serious Materials For Making Furniture
            </h2>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Because Panto was very serious about designing furniture for our environment, using a very expensive and famous capital but at a relatively low price.
            </p>
            <a href="#" className="text-accent-orange hover:underline font-medium">
              More Info →
            </a>
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`Interior ${index + 1}`}
                  className="w-full h-[240px] object-cover rounded-lg shadow-card hover:shadow-hover transition-shadow"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
