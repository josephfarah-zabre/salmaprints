import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import storyShowroomImg from "@/assets/about-story-showroom.jpg";
import showroomImg from "@/assets/about-showroom.jpg";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-[150px] px-4">
          <div className="container mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 py-[10px] text-slate-50 lg:text-7xl">
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

        {/* Company Story - Section 1 */}
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
                  <img src={storyShowroomImg} alt="Masco Salma Print Showroom" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Image Section 2 */}
        <section className="py-16 px-4 bg-background-secondary">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up order-2 md:order-1">
                <div className="aspect-square rounded-lg overflow-hidden shadow-elegant">
                  <img src={showroomImg} alt="Our Products" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="animate-slide-up order-1 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Commitment
                </h2>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    At Masco Salma Print, we believe in delivering more than just products. 
                    We deliver experiences that matter. Our team is dedicated to understanding 
                    your needs and providing solutions that exceed expectations.
                  </p>
                  <p>
                    With state-of-the-art facilities and a passionate team, we ensure every 
                    project receives the attention it deserves. From concept to completion, 
                    we're with you every step of the way.
                  </p>
                  <p className="text-primary font-semibold text-lg">
                    Your success is our success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Image Section 3 */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Looking Forward
                </h2>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    As we continue to grow, our focus remains on innovation and customer 
                    satisfaction. We're constantly exploring new technologies and methods 
                    to enhance our services and bring you the best possible results.
                  </p>
                  <p>
                    Join us on this journey as we shape the future of custom printing 
                    and promotional products. Together, we can create something extraordinary.
                  </p>
                  <p className="text-primary font-semibold text-lg">
                    The best is yet to come.
                  </p>
                </div>
              </div>
              <div className="animate-slide-up">
                <div className="aspect-square rounded-lg overflow-hidden shadow-elegant">
                  <img src={storyShowroomImg} alt="Our Future" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 bg-primary text-foreground">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Contact us today and let's discuss how we can help bring your vision to life.
            </p>
            <a 
              href="https://wa.me/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-background text-primary px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get in Touch on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
