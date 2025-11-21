import { Clock, Palette, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const WhyChooseUs = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Clock,
      titleKey: "features.fastTurnaround.title",
      descriptionKey: "features.fastTurnaround.description"
    },
    {
      icon: Palette,
      titleKey: "features.customDesign.title",
      descriptionKey: "features.customDesign.description"
    },
    {
      icon: Shield,
      titleKey: "features.qualityGuarantee.title",
      descriptionKey: "features.qualityGuarantee.description"
    }
  ];
  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#D47B9B' }}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-white/20">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{t(feature.titleKey)}</h3>
              <p className="text-white mb-4 leading-relaxed">{t(feature.descriptionKey)}</p>
              <a href="#" className="text-white hover:underline font-medium">
                {t("features.moreInfo")}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
