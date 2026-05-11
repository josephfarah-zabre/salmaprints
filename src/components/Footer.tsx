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
  const { t } = useLanguage();
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-6">
          {socials.map((s) => (
        <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
          <div>
            <img src={s.icon} alt={s.name} className={`object-contain ${s.name === "WhatsApp" ? "w-[50px] h-[50px]" : "w-14 h-14"}`} />
          </div>
        </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
