import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
    en: "Turning Your Dreams into Reality", 
    ar: "نحول أحلامك إلى واقع" 
  },
  "hero.subtitle": { 
    en: "We Deliver your Orders all over Lebanon within 2 days only", 
    ar: "نوصل طلباتك إلى جميع أنحاء لبنان خلال يومين فقط" 
  },
  "hero.search": { en: "Search for products or categories...", ar: "ابحث عن المنتجات أو الفئات..." },

  // Catalogue
  "catalogue.title.prefix": { en: "Discover Our", ar: "اكتشف" },
  "catalogue.title.highlight": { en: "Products", ar: "منتجاتنا" },
  "catalogue.subtitle": {
    en: "Browse our carefully curated collection. Contact us on WhatsApp for any inquiries.",
    ar: "تصفح مجموعتنا المختارة بعناية. تواصل معنا على واتساب لأي استفسار."
  },
  
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
  "about.story.title": { en: "Our Services", ar: "خدماتنا" },
  "about.story.p1": { 
    en: "At Masco Salma Print, we offer comprehensive printing solutions including business cards, posters, brochures, invoices, invitation cards, labels, restaurant menus, and booklets.", 
    ar: "في ماسكو سلمى برينت، نقدم حلول طباعة شاملة تشمل بطاقات العمل، البوسترات، البروشورات، الفواتير، كروت الدعوة، الليبلز (الستيكرات)، منيو المطاعم والكافيهات، والكتيبات الصغيرة." 
  },
  "about.story.p2": { 
    en: "Our printing services extend to custom apparel with DTF and sublimation printing on t-shirts, caps, blouses, and event/school uniforms. We also specialize in personalized gift printing including mugs, boxes, pillows, paintings, and corporate gifts.", 
    ar: "تمتد خدمات الطباعة لدينا إلى الملابس المخصصة بطباعة DTF والسابلوميشن على التيشيرتات، القبعات، البلوزات، وأزياء الفعاليات والمدارس. كما نتخصص في طباعة الهدايا الشخصية بما في ذلك المجات، البوكسات، الوسادات، اللوحات، وهدايا المناسبات والشركات." 
  },
  "about.story.quote": { 
    en: "Quality printing and creative design for every occasion.", 
    ar: "طباعة عالية الجودة وتصميم إبداعي لكل مناسبة." 
  },
  "about.commitment.title": { en: "Our Commitment to Excellence", ar: "التزامنا بالتميز" },
  "about.commitment.p1": { 
    en: "We combine traditional craftsmanship with modern technology, offering laser cutting and engraving services on acrylic, wood, medals, name plates, stands, gift wrapping, and party decorations.", 
    ar: "نجمع بين الحرفية التقليدية والتكنولوجيا الحديثة، ونقدم خدمات الحفر والقص بالليزر على الأكريليك، الخشب، الميداليات، لوحات الأسماء، الستاندات، تغليف الهدايا، وديكورات الحفلات." 
  },
  "about.commitment.p2": { 
    en: "Our professional graphic design team creates logos, brand identities, social media posts, brochures, stickers, and prepares files for perfect printing results.", 
    ar: "فريق التصميم الجرافيكي المحترف لدينا يبتكر اللوجو والهوية البصرية، بوستات السوشال ميديا، البروشورات، الملصقات، ويجهز الملفات للطباعة المثالية." 
  },
  "about.commitment.quote": { 
    en: "Precision, creativity, and excellence in every project.", 
    ar: "الدقة والإبداع والتميز في كل مشروع." 
  },
  "about.forward.title": { en: "Complete Solutions", ar: "خدمات متكاملة" },
  "about.forward.p1": { 
    en: "We provide additional services including thermal wrapping, plastification, cutting and numbering, gift preparation, and complete campaign setups for schools and companies.", 
    ar: "نوفر خدمات إضافية تشمل التغليف الحراري، البلاستيفيك، القص والترقيم، تجهيز الهدايا، وإعداد حملات كاملة للمدارس والشركات." 
  },
  "about.forward.p2": { 
    en: "From concept to completion, we handle every detail of your printing and design needs with professional care and attention.", 
    ar: "من الفكرة إلى التنفيذ، نتعامل مع كل تفاصيل احتياجاتك في الطباعة والتصميم بعناية واحترافية." 
  },
  "about.forward.quote": { 
    en: "Your vision, our expertise – creating memorable impressions together.", 
    ar: "رؤيتك، خبرتنا – نصنع انطباعات لا تُنسى معًا." 
  },
  "about.cta.title": { en: "Ready to Work with Us?", ar: "هل أنت مستعد للعمل معنا؟" },
  "about.cta.description": { 
    en: "Get in touch today to discuss your project and discover how we can help bring your ideas to life.", 
    ar: "تواصل معنا اليوم لمناقشة مشروعك واكتشف كيف يمكننا مساعدتك في تحقيق أفكارك." 
  },
  "about.cta.button": { en: "Contact Us on WhatsApp", ar: "تواصل معنا على واتساب" },
  
  // Search
  "search.products": { en: "Products", ar: "المنتجات" },
  "search.categories": { en: "Categories", ar: "الفئات" },
  "search.noResults": { en: "No results found", ar: "لم يتم العثور على نتائج" },
  
  // Why Choose Us
  "features.fastTurnaround.title": { en: "Fast Turnaround", ar: "تسليم سريع" },
  "features.fastTurnaround.description": { 
    en: "Quick production and delivery times to meet your deadlines. Most orders completed within 3-5 business days with rush options available.", 
    ar: "أوقات إنتاج وتسليم سريعة لتلبية مواعيدك النهائية. معظم الطلبات تكتمل خلال 3-5 أيام عمل مع توفر خيارات التسليم السريع." 
  },
  "features.customDesign.title": { en: "Custom Design Support", ar: "دعم التصميم المخصص" },
  "features.customDesign.description": { 
    en: "Our design team provides free assistance to bring your vision to life. From simple logos to complex artwork, we've got you covered.", 
    ar: "يقدم فريق التصميم لدينا مساعدة مجانية لتحقيق رؤيتك. من الشعارات البسيطة إلى الأعمال الفنية المعقدة، نحن نغطي احتياجاتك." 
  },
  "features.qualityGuarantee.title": { en: "Quality Guarantee", ar: "ضمان الجودة" },
  "features.qualityGuarantee.description": { 
    en: "We use premium materials and state-of-the-art printing technology. 100% satisfaction guaranteed or we'll make it right.", 
    ar: "نستخدم مواد عالية الجودة وتقنية طباعة حديثة. ضمان رضا 100٪ أو سنصحح الأمر." 
  },
  "features.moreInfo": { en: "More Info →", ar: "معلومات أكثر ←" },
  
  // Top Selling Products
  "topProducts.title": { en: "Top Selling Products", ar: "المنتجات الأكثر مبيعاً" },
  "topProducts.description": { en: "Check out our most popular electronics and trending items", ar: "تحقق من أكثر إلكترونياتنا شعبية والعناصر الرائجة" },
  "topProducts.viewAll": { en: "View All Products", ar: "عرض جميع المنتجات" },
  
  // Experience Section
  "experience.label": { en: "OUR PROCESS", ar: "عمليتنا" },
  "experience.title": { en: "Professional Printing Services You Can Trust", ar: "خدمات طباعة احترافية يمكنك الوثوق بها" },
  "experience.description": { 
    en: "With state-of-the-art printing equipment and experienced professionals, we deliver exceptional quality on every order. From concept to completion, we ensure your custom products exceed expectations.", 
    ar: "مع معدات طباعة حديثة ومحترفين ذوي خبرة، نقدم جودة استثنائية في كل طلب. من الفكرة إلى الإنجاز، نضمن أن منتجاتك المخصصة تفوق التوقعات." 
  },
  "experience.cta": { en: "Get a Quote →", ar: "احصل على عرض أسعار ←" },
  
  // Materials Section
  "materials.label": { en: "WHAT WE PRINT", ar: "ما نطبعه" },
  "materials.title": { en: "Wide Range of Custom Printing Services", ar: "مجموعة واسعة من خدمات الطباعة المخصصة" },
  "materials.description": { 
    en: "From custom t-shirts and mugs to business cards, banners, and promotional items - we print it all. Premium quality materials and vibrant, long-lasting prints for all your branding needs.", 
    ar: "من القمصان والأكواب المخصصة إلى بطاقات الأعمال واللافتات والمواد الترويجية - نطبع كل شيء. مواد عالية الجودة ومطبوعات نابضة بالحياة وطويلة الأمد لجميع احتياجات علامتك التجارية." 
  },
  "materials.cta": { en: "View Products →", ar: "عرض المنتجات ←" },
  
  // Testimonials
  "testimonials.label": { en: "REVIEWS", ar: "التقييمات" },
  "testimonials.title": { en: "WHAT OUR CUSTOMERS SAY ABOUT US", ar: "ماذا يقول عملاؤنا عنا" },
  
  // Product Card
  "product.inquire": { en: "Inquire on WhatsApp", ar: "استفسر عبر واتساب" },
  "product.new": { en: "New", ar: "جديد" },
  "product.featured": { en: "Featured", ar: "مميز" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("ar");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  // Set initial direction and language on mount
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, []);

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
