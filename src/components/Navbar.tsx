import { Link } from "react-router-dom";
import { LanguageToggle } from "./LanguageToggle";
import { SearchBar } from "./SearchBar";
import { MobileHeader } from "./MobileHeader";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50">
      <MobileHeader />
      {/* Top brand bar — navy (desktop) */}
      <div className="bg-primary text-primary-foreground hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 md:gap-6 h-16 md:h-20">
            <Link to="/" className="flex flex-col leading-tight font-extrabold shrink-0">
              <span dir="rtl" lang="ar" className="text-base md:text-xl">مطبعة سلمى</span>
              <span className="text-xs md:text-sm opacity-90 font-latin tracking-wide">Salma Print</span>
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
