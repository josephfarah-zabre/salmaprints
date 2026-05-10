import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown } from "lucide-react";

interface Cat {
  id: string;
  name: string;
}

export const CategoryNavStrip = () => {
  const [cats, setCats] = useState<Cat[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name")
      .order("display_order")
      .then(({ data }) => setCats(data || []));
  }, []);

  return (
    <nav className="bg-white border-b border-border sticky top-16 md:top-20 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar h-12">
          <button className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold text-foreground hover:bg-muted">
            <span className="text-lg leading-none">≡</span>
            <span className="hidden sm:inline">All</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <span className="h-5 w-px bg-border mx-1 shrink-0" />
          {cats.slice(0, 8).map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted transition-colors whitespace-nowrap"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
