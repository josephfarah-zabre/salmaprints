export const ExperienceSection = () => {
  return (
    <section className="py-20 px-4 bg-background-secondary">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop" 
              alt="Colorful watches"
              className="w-full h-[500px] object-cover rounded-lg shadow-card"
            />
          </div>
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold text-accent-orange mb-4 tracking-wider">EXPERIENCE</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground leading-tight">
              We Provide You The Best Experience
            </h2>
            <p className="text-text-secondary mb-6 leading-relaxed">
              You don't have to worry about the result because all of these interiors are made by people who are professionals in their fields with an elegant and lucrative style and with premium quality materials.
            </p>
            <a href="#" className="text-accent-orange hover:underline font-medium">
              More Info →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
