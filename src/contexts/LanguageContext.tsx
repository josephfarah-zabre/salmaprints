import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ar";

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  "nav.products": { en: "Products", ar: "المنتجات" },
  "nav.about": { en: "About Us", ar: "من نحن" },
  "nav.contact": { en: "Contact", ar: "اتصل بنا" },
  
  // Hero
  "hero.title": { 
    en: "Custom Printing & Promotional Products for Your Business", 
    ar: "طباعة مخصصة ومنتجات ترويجية لعملك" 
  },
  "hero.subtitle": { 
    en: "High-quality custom printing services for t-shirts, mugs, bags, and promotional materials. Fast turnaround and professional results.", 
    ar: "خدمات طباعة مخصصة عالية الجودة للقمصان والأكواب والحقائب والمواد الترويجية. نتائج سريعة واحترافية." 
  },
  "hero.search": { en: "Search for products or categories...", ar: "ابحث عن المنتجات أو الفئات..." },
  
  // Banner
  "banner.text": { 
    en: "Everything You Need for Your Business • Quality Products at Great Prices • Fast & Reliable Service • Wide Range of Categories • Contact Us on WhatsApp", 
    ar: "كل ما تحتاجه لعملك • منتجات عالية الجودة بأسعار رائعة • خدمة سريعة وموثوقة • مجموعة واسعة من الفئات • اتصل بنا على واتساب" 
  },
  
  // Categories
  "categories.title": { en: "EXPLORE OUR CATEGORIES", ar: "استكشف فئاتنا" },
  "categories.label": { en: "CATEGORIES", ar: "الفئات" },
  "categories.explore": { en: "Explore All Categories", ar: "استكشف جميع الفئات" },
  
  // Footer
  "footer.follow": { en: "Follow Us", ar: "تابعنا" },
  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  
  // About Page
  "about.title": { en: "About", ar: "عن" },
  "about.company": { en: "Masco Salma Print", ar: "ماسكو سلمى للطباعة" },
  "about.tagline": { 
    en: "Your trusted partner for quality products and exceptional service", 
    ar: "شريكك الموثوق للمنتجات عالية الجودة والخدمة الاستثنائية" 
  },
  "about.story.title": { en: "Our Story", ar: "قصتنا" },
  "about.story.p1": { 
    en: "Founded with a vision to provide exceptional products and services, Masco Salma Print has grown into a trusted name in the industry. Our journey began with a simple mission: to make quality products accessible to everyone.", 
    ar: "تأسست ماسكو سلمى للطباعة برؤية لتقديم منتجات وخدمات استثنائية، وقد نمت لتصبح اسماً موثوقاً في الصناعة. بدأت رحلتنا بمهمة بسيطة: جعل المنتجات عالية الجودة في متناول الجميع." 
  },
  "about.story.p2": { 
    en: "Over the years, we've built strong relationships with our customers and suppliers, always maintaining our commitment to excellence. Every product in our catalog is carefully selected to meet our high standards.", 
    ar: "على مر السنين، بنينا علاقات قوية مع عملائنا ومورّدينا، مع الحفاظ دائماً على التزامنا بالتميز. يتم اختيار كل منتج في كتالوجنا بعناية لتلبية معاييرنا العالية." 
  },
  "about.story.quote": { 
    en: "\"Quality is not an act, it is a habit.\" - This philosophy guides everything we do.", 
    ar: "\"الجودة ليست فعلاً، بل عادة.\" - هذه الفلسفة توجه كل ما نقوم به." 
  },
  "about.commitment.title": { en: "Our Commitment", ar: "التزامنا" },
  "about.commitment.p1": { 
    en: "At Masco Salma Print, we believe in delivering more than just products. We deliver experiences that matter. Our team is dedicated to understanding your needs and providing solutions that exceed expectations.", 
    ar: "في ماسكو سلمى للطباعة، نؤمن بتقديم أكثر من مجرد منتجات. نحن نقدم تجارب مهمة. فريقنا مكرس لفهم احتياجاتك وتقديم حلول تفوق التوقعات." 
  },
  "about.commitment.p2": { 
    en: "With state-of-the-art facilities and a passionate team, we ensure every project receives the attention it deserves. From concept to completion, we're with you every step of the way.", 
    ar: "من خلال مرافق حديثة وفريق متحمس، نضمن أن كل مشروع يحصل على الاهتمام الذي يستحقه. من الفكرة إلى الإنجاز، نحن معك في كل خطوة." 
  },
  "about.commitment.quote": { 
    en: "Your success is our success.", 
    ar: "نجاحك هو نجاحنا." 
  },
  "about.forward.title": { en: "Looking Forward", ar: "نتطلع للمستقبل" },
  "about.forward.p1": { 
    en: "As we continue to grow, our focus remains on innovation and customer satisfaction. We're constantly exploring new technologies and methods to enhance our services and bring you the best possible results.", 
    ar: "بينما نستمر في النمو، يبقى تركيزنا على الابتكار ورضا العملاء. نحن نستكشف باستمرار تقنيات وأساليب جديدة لتعزيز خدماتنا وتقديم أفضل النتائج الممكنة لك." 
  },
  "about.forward.p2": { 
    en: "Join us on this journey as we shape the future of custom printing and promotional products. Together, we can create something extraordinary.", 
    ar: "انضم إلينا في هذه الرحلة بينما نشكل مستقبل الطباعة المخصصة والمنتجات الترويجية. معاً، يمكننا إنشاء شيء استثنائي." 
  },
  "about.forward.quote": { 
    en: "The best is yet to come.", 
    ar: "الأفضل لم يأتِ بعد." 
  },
  "about.cta.title": { en: "Ready to Get Started?", ar: "هل أنت مستعد للبدء؟" },
  "about.cta.description": { 
    en: "Contact us today and let's discuss how we can help bring your vision to life.", 
    ar: "اتصل بنا اليوم ودعنا نناقش كيف يمكننا مساعدتك في تحقيق رؤيتك." 
  },
  "about.cta.button": { en: "Get in Touch on WhatsApp", ar: "تواصل معنا على واتساب" },
  
  // Search
  "search.products": { en: "Products", ar: "المنتجات" },
  "search.categories": { en: "Categories", ar: "الفئات" },
  "search.noResults": { en: "No results found", ar: "لم يتم العثور على نتائج" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
