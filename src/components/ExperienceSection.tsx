import { useLanguage } from "@/contexts/LanguageContext";

export const ExperienceSection = () => {
  const { t } = useLanguage();
  return <section className="py-20 px-4 bg-primary">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop" alt="Colorful watches" className="w-full h-[250px] lg:h-[500px] object-cover rounded-lg shadow-card" />
          </div>
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold text-accent-orange mb-4 tracking-wider text-slate-50">{t("experience.label")}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground leading-tight">
              {t("experience.title")}
            </h2>
            <p className="text-primary-foreground/90 mb-6 leading-relaxed">
              {t("experience.description")}
            </p>
            <a href="#contact" className="text-primary-foreground hover:underline font-medium">
              {t("experience.cta")}
            </a>
          </div>
        </div>
      </div>
    </section>;
};