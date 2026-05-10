import { Link } from "react-router-dom";
import { LanguageToggle } from "./LanguageToggle";
import { SearchBar } from "./SearchBar";
import { MobileHeader } from "./MobileHeader";
import logo from "@/assets/masco-salma-logo.png";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50">
      <MobileHeader />
      {/* Top brand bar — navy (desktop) */}
      <div className="bg-primary text-primary-foreground hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 md:gap-6 h-16 md:h-20">
            <Link to="/" className="shrink-0 flex items-center" aria-label="Masco Salma Print">
              <div className="bg-white rounded-xl p-1.5 flex items-center">
                <img src={logo} alt="Masco Salma Print" className="h-12 md:h-14 w-auto object-contain" />
              </div>
            </Link>

            <div className="flex-1 max-w-2xl">
              <SearchBar />
            </div>

            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
