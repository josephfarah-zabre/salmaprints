import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin } from "lucide-react";
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

const LOCATION_URL = "https://maps.app.goo.gl/Um5VpxUFVubLwizq5?g_st=ac";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-8">
          {socials.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
              <img
                src={s.icon}
                alt={s.name}
                className={`object-contain ${s.name === "WhatsApp" ? "w-[42px] h-[42px]" : "w-[72px] h-[72px]"}`}
              />
            </a>
          ))}
          <a href={LOCATION_URL} target="_blank" rel="noopener noreferrer" aria-label="Location">
            <MapPin className="w-[72px] h-[72px]" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
