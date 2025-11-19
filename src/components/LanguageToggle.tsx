import { useState } from "react";
import { Button } from "./ui/button";

export const LanguageToggle = () => {
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const toggleLanguage = (lang: "en" | "ar") => {
    setLanguage(lang);
    // TODO: Implement actual translation logic here
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => toggleLanguage("en")}
        className="min-w-[60px]"
      >
        English
      </Button>
      <Button
        variant={language === "ar" ? "default" : "outline"}
        size="sm"
        onClick={() => toggleLanguage("ar")}
        className="min-w-[60px]"
      >
        العربية
      </Button>
    </div>
  );
};
