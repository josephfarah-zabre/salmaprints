import { Link } from "react-router-dom";
import { LanguageToggle } from "./LanguageToggle";
import { SearchBar } from "./SearchBar";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-tight text-white font-bold shrink-0">
            <span dir="rtl" lang="ar" className="text-lg md:text-2xl">مطبعة سلمى</span>
            <span className="text-lg md:text-2xl">Salma Print</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>

          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
};
