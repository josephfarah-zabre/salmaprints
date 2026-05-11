import { MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import tiktokIcon from "@/assets/tiktok-icon.png";
import facebookIcon from "@/assets/facebook-icon.png";
import whatsappIcon from "@/assets/whatsapp-logo.png";
import instagramIcon from "@/assets/instagram-icon.png";

const socials = [
  { name: "TikTok", icon: tiktokIcon, url: "https://vm.tiktok.com/ZS9NTNuFqA79V-5mWdt/" },
  { name: "Facebook", icon: facebookIcon, url: "https://www.facebook.com/share/1XhyHNDun1/" },
  { name: "WhatsApp", icon: whatsappIcon, url: "https://wa.me/message/5JHP3PKIIBIRK1" },
  { name: "Instagram", icon: instagramIcon, url: "https://www.instagram.com/masco.salma.print?igsh=MXJpZnA1cHZxdGlv" },
];

const Footer = () => {
  const { language } = useLanguage();
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-10">
          {socials.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
              <img
                src={s.icon}
                alt={s.name}
                className={`object-contain ${s.name === "WhatsApp" ? "w-[42px] h-[42px]" : "w-[72px] h-[72px]"}`}
              />
            </a>
          ))}
        </div>

        <div className="mt-6 flex justify-center items-center gap-4 sm:gap-6 text-white/80">
          <a
            href="https://maps.google.com/?q=Masco+Salma+Print"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
            <span className="text-sm sm:text-base font-bold">
              {language === "ar" ? "زورونا" : "Visit our location"}
            </span>
          </a>
          <span className="h-6 sm:h-7 w-px bg-white/40" aria-hidden="true" />
          <a href="tel:03304566" className="flex items-center gap-2 hover:text-white transition-colors">
            <Phone className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
            <span className="text-sm sm:text-base font-bold" dir="ltr">03304566</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
