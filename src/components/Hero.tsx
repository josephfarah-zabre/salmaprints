import heroImage from "@/assets/hero-woman-mug.jpg";
import { SearchBar } from "./SearchBar";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();
  return <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary bg-cover" style={{
    backgroundImage: `url(${heroImage})`,
    backgroundPosition: 'center center'
  }}>
      {/* Content */}
      <div className="relative container mx-auto px-4 py-32 text-center z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl mb-6 leading-tight text-white lg:text-5xl font-medium">
            {t("hero.title")}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
            {t("hero.subtitle")}
          </p>
          
          {/* Search Bar */}
          <SearchBar />
        </div>
      </div>
    </section>;
};