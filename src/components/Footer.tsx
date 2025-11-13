import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import facebookIcon from "@/assets/facebook-icon.png";
import instagramIcon from "@/assets/instagram-icon.png";
import tiktokIcon from "@/assets/tiktok-icon.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-secondary border-t-2 border-primary-subtle mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <img src={logo} alt="Masco Salma Print" className="h-16 object-contain" />
            <p className="text-text-secondary text-sm">
              Your trusted partner for quality products and exceptional service.
            </p>
          </div>

          {/* Sitemap */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">Sitemap</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-text-secondary hover:text-primary transition-colors link-underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/catalogue" 
                  className="text-text-secondary hover:text-primary transition-colors link-underline"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-text-secondary hover:text-primary transition-colors link-underline"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-subtle hover:bg-primary transition-all duration-300 flex items-center justify-center hover:-translate-y-1 hover:shadow-hover"
              >
                <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-subtle hover:bg-primary transition-all duration-300 flex items-center justify-center hover:-translate-y-1 hover:shadow-hover"
              >
                <img src={instagramIcon} alt="Instagram" className="w-6 h-6" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-subtle hover:bg-primary transition-all duration-300 flex items-center justify-center hover:-translate-y-1 hover:shadow-hover"
              >
                <img src={tiktokIcon} alt="TikTok" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-text-tertiary text-sm">
            &copy; {currentYear} Masco Salma Print. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

