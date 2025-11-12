import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import facebookIcon from "@/assets/facebook-icon.png";
import instagramIcon from "@/assets/instagram-icon.png";
import tiktokIcon from "@/assets/tiktok-icon.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logo} alt="Masco Salma Print" className="h-16 object-contain mb-4" />
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Your trusted source for quality products
            </p>
          </div>

          {/* Sitemap Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4 text-foreground">Sitemap</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
            </nav>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-semibold mb-4 text-foreground">Follow Us</h3>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a href="#" className="w-10 h-10 rounded-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer">
                <img src={facebookIcon} alt="Facebook" className="w-full h-full object-cover" />
              </a>
              {/* Instagram */}
              <a href="#" className="w-10 h-10 rounded-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer">
                <img src={instagramIcon} alt="Instagram" className="w-full h-full object-cover" />
              </a>
              {/* TikTok */}
              <a href="#" className="w-10 h-10 rounded-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer">
                <img src={tiktokIcon} alt="TikTok" className="w-full h-full object-cover" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Masco Salma Print. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
