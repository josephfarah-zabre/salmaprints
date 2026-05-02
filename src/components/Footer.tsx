import { useLanguage } from "@/contexts/LanguageContext";
import tiktokIcon from "@/assets/tiktok-icon.png";
import facebookIcon from "@/assets/facebook-icon.png";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import instagramIcon from "@/assets/instagram-icon.png";

const socials = [
  { name: "TikTok", icon: tiktokIcon, url: "https://www.tiktok.com/" },
  { name: "Facebook", icon: facebookIcon, url: "https://www.facebook.com/share/1XhyHNDun1/" },
  { name: "WhatsApp", icon: whatsappIcon, url: "https://wa.me/message/5JHP3PKIIBIRK1" },
  { name: "Instagram", icon: instagramIcon, url: "https://www.instagram.com/masco.salma.print?igsh=MXJpZnA1cHZxdGlv" },
];

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-6 mb-8">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              className="transition-transform hover:scale-110"
            >
              <img src={s.icon} alt={`${s.name} icon`} className="w-30 h-30 object-contain" style={{ width: "120px", height: "120px" }} />
            </a>
          ))}
        </div>
        <div className="text-center">
          <p className="text-white/50">
            © {new Date().getFullYear()} Masco Salma Print. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
