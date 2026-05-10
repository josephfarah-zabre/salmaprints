import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";

interface Cat {
  id: string;
  name: string;
}

interface SearchResult {
  id: string;
  name: string;
  image_url: string | null;
  type: "product" | "category";
}

export const MobileHeader = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cats, setCats] = useState<Cat[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // Trailing edge for the drawer respects RTL/LTR.
  const trailingSide = language === "ar" ? "left" : "right";
  const Chevron = language === "ar" ? ChevronLeft : ChevronRight;

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name")
      .order("display_order")
      .then(({ data }) => setCats(data || []));
  }, []);

  // Notify FloatingWhatsApp to hide while a sheet is open.
  useEffect(() => {
    const open = navOpen || searchOpen;
    window.dispatchEvent(new CustomEvent("mobile-overlay", { detail: { open } }));
  }, [navOpen, searchOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const [{ data: products }, { data: categories }] = await Promise.all([
        supabase.from("products").select("id, name, image_url").ilike("name", `%${query}%`).limit(8),
        supabase.from("categories").select("id, name, image_url").ilike("name", `%${query}%`).limit(5),
      ]);
      setResults([
        ...(categories || []).map((c) => ({ ...c, type: "category" as const })),
        ...(products || []).map((p) => ({ ...p, type: "product" as const })),
      ]);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const goCategory = (id: string) => {
    setNavOpen(false);
    navigate(`/category/${id}`);
  };

  const goResult = (r: SearchResult) => {
    setSearchOpen(false);
    setQuery("");
    navigate(r.type === "category" ? `/category/${r.id}` : `/product/${r.id}`);
  };

  return (
    <>
      <div className="bg-primary text-primary-foreground md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              aria-haspopup="menu"
              aria-expanded={navOpen}
              className="w-11 h-11 -ms-2 flex items-center justify-center rounded-md hover:bg-white/10"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex flex-col items-center leading-tight font-extrabold">
              <span dir="rtl" lang="ar" className="text-base">مطبعة سلمى</span>
              <span className="text-[10px] opacity-90 font-latin tracking-wide">Salma Print</span>
            </Link>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="w-11 h-11 -me-2 flex items-center justify-center rounded-md hover:bg-white/10"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Nav drawer */}
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent side={trailingSide} className="w-[85vw] sm:max-w-sm p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-border flex-row items-center justify-between space-y-0">
            <SheetTitle className="text-base">{language === "ar" ? "القائمة" : "Menu"}</SheetTitle>
          </SheetHeader>
          <div className="p-4 border-b border-border">
            <LanguageToggle />
          </div>
          <button
            type="button"
            onClick={() => {
              setNavOpen(false);
              setTimeout(() => setSearchOpen(true), 150);
            }}
            className="mx-4 mt-4 flex items-center gap-3 px-4 h-11 rounded-full bg-muted text-sm text-muted-foreground"
          >
            <Search className="w-4 h-4" />
            {t("hero.search")}
          </button>
          <nav className="flex-1 overflow-y-auto py-2">
            {cats.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => goCategory(c.id)}
                className="w-full flex items-center justify-between px-5 min-h-[48px] text-start text-foreground hover:bg-muted transition-colors border-b border-border/40"
              >
                <span className="text-sm font-medium">{c.name}</span>
                <Chevron className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Full-screen search sheet */}
      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent side="top" className="h-screen w-full p-0 flex flex-col">
          <div className="flex items-center gap-2 p-3 border-b border-border bg-primary text-primary-foreground">
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("hero.search")}
              className="flex-1 h-10 px-4 rounded-full bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {results.map((r) => (
              <button
                key={`${r.type}-${r.id}`}
                type="button"
                onClick={() => goResult(r)}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted text-start border-b border-border/40"
              >
                <div className="w-12 h-12 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  {r.image_url && (
                    <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{r.type}</p>
                </div>
              </button>
            ))}
            {query.length >= 2 && results.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                {t("search.noResults")}
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileHeader;
