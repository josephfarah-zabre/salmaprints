import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

type Product = Tables<"products">;
type Category = Tables<"categories">;

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

  useEffect(() => {
    const searchProductsAndCategories = async () => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      try {
        // Search products
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("id, name, image_url")
          .ilike("name", `%${searchQuery}%`)
          .limit(5);

        // Search categories
        const { data: categories, error: categoriesError } = await supabase
          .from("categories")
          .select("id, name, image_url")
          .ilike("name", `%${searchQuery}%`)
          .limit(5);

        if (productsError || categoriesError) {
          console.error("Search error:", productsError || categoriesError);
          return;
        }

        const productResults: SearchResult[] = (products || []).map((p) => ({
          id: p.id,
          name: p.name,
          image_url: p.image_url,
          type: "product" as const,
        }));

        const categoryResults: SearchResult[] = (categories || []).map((c) => ({
          id: c.id,
          name: c.name,
          image_url: c.image_url,
          type: "category" as const,
        }));

        const allResults = [...categoryResults, ...productResults];
        setResults(allResults);
        setIsOpen(allResults.length > 0);
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    const debounceTimer = setTimeout(searchProductsAndCategories, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "category") {
      navigate(`/category/${result.id}`);
    } else {
      navigate(`/catalogue`);
    }
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50 pointer-events-none z-10" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && results.length > 0 && setIsOpen(true)}
          className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent-orange shadow-elegant"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-elegant border border-border z-50 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result)}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                {result.image_url ? (
                  <img
                    src={result.image_url}
                    alt={result.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Search className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{result.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{result.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
