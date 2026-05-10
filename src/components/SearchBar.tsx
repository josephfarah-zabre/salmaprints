import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchResult {
  id: string;
  name: string;
  image_url: string | null;
  type: "product" | "category";
}

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const run = async () => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      try {
        const [{ data: products }, { data: categories }] = await Promise.all([
          supabase.from("products").select("id, name, image_url").ilike("name", `%${searchQuery}%`).limit(5),
          supabase.from("categories").select("id, name, image_url").ilike("name", `%${searchQuery}%`).limit(5),
        ]);
        const all: SearchResult[] = [
          ...(categories || []).map((c) => ({ ...c, type: "category" as const })),
          ...(products || []).map((p) => ({ ...p, type: "product" as const })),
        ];
        setResults(all);
        setIsOpen(all.length > 0);
      } catch (e) {
        console.error("Search error:", e);
      }
    };
    const timer = setTimeout(run, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "category") navigate(`/category/${result.id}`);
    else navigate(`/product/${result.id}`);
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
        <input
          type="text"
          placeholder={t("hero.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && results.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-lg border border-border z-50 max-h-96 overflow-y-auto">
          {results.map((r) => (
            <button
              key={`${r.type}-${r.id}`}
              onMouseDown={() => handleResultClick(r)}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                {r.image_url ? (
                  <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Search className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{r.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
