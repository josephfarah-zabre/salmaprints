import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const {
    t
  } = useLanguage();
  const navItems = [{
    name: t("nav.products"),
    path: "/catalogue"
  }, {
    name: t("nav.about"),
    path: "/about"
  }, {
    name: t("nav.contact"),
    path: "#contact"
  }];
  return <nav className="sticky top-0 left-0 right-0 z-50 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex flex-col leading-tight text-white font-bold">
              <span dir="rtl" lang="ar" className="text-sm">مطبعة سلمى</span>
              <span className="text-2xl">Salma Print</span>
            </Link>
            <a href="tel:+96103304566" dir="ltr" className="hidden sm:inline text-white/90 hover:text-white text-sm font-medium">
              +961 03 30 45 66
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => <Link key={item.name} to={item.path} className="text-white hover:text-white/80 transition-colors px-[10px]">
                {item.name}
              </Link>)}
            <LanguageToggle />
            <button className="relative p-2 text-white hover:text-white/80 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white" aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="md:hidden py-4 bg-primary rounded-lg mt-2">
            <div className="flex flex-col space-y-4">
              {navItems.map(item => <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className="px-4 text-white hover:text-white/80">
                  {item.name}
                </Link>)}
              <div className="px-4">
                <LanguageToggle />
              </div>
            </div>
          </div>}
      </div>
    </nav>;
};