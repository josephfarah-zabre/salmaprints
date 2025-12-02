import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import storyShowroomImg from "@/assets/about-story-showroom.jpg";
import showroomImg from "@/assets/about-showroom.jpg";
import futurePrintingImg from "@/assets/about-future-printing.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-[150px] px-4">
          <div className="container mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 py-[10px] text-slate-50 lg:text-7xl">
              {t("about.title")}{" "}
              <span className="relative inline-block">
                {t("about.company")}
                <span className="absolute bottom-2 left-0 w-full h-1 bg-primary rounded-full transform -rotate-1"></span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
              {t("about.tagline")}
            </p>
          </div>
        </section>

        {/* Company Story - Section 1 */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {t("about.story.title")}
                </h2>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>{t("about.story.p1")}</p>
                  <p>{t("about.story.p2")}</p>
                  <p className="text-primary font-semibold text-lg">
                    {t("about.story.quote")}
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
                  {t("about.commitment.title")}
                </h2>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>{t("about.commitment.p1")}</p>
                  <p>{t("about.commitment.p2")}</p>
                  <p className="text-primary font-semibold text-lg">
                    {t("about.commitment.quote")}
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
                  {t("about.forward.title")}
                </h2>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>{t("about.forward.p1")}</p>
                  <p>{t("about.forward.p2")}</p>
                  <p className="text-primary font-semibold text-lg">
                    {t("about.forward.quote")}
                  </p>
                </div>
              </div>
              <div className="animate-slide-up">
                <div className="aspect-square rounded-lg overflow-hidden shadow-elegant">
                  <img src={futurePrintingImg} alt="Our Future" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 bg-primary text-foreground">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("about.cta.title")}
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              {t("about.cta.description")}
            </p>
            <a 
              href="https://wa.me/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-background text-primary px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {t("about.cta.button")}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
