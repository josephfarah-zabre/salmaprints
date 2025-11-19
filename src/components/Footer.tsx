import facebookIcon from "@/assets/facebook-icon.png";
import instagramIcon from "@/assets/instagram-icon.png";
import tiktokIcon from "@/assets/tiktok-icon.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          {/* Follow Us */}
          <div className="text-center">
            <h4 className="font-semibold mb-6 text-xl">{t("footer.follow")}</h4>
            <div className="flex items-center justify-center gap-6">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img src={facebookIcon} alt="Facebook" className="w-10 h-10" />
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img src={instagramIcon} alt="Instagram" className="w-10 h-10" />
              </a>
              <a 
                href="https://www.tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img src={tiktokIcon} alt="TikTok" className="w-10 h-10" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/50">
            © {new Date().getFullYear()} Masco Salma Print. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
