import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategoryCircle } from "./CategoryCircle";

interface Cat {
  id: string;
  name: string;
  image_url: string | null;
}

export const RoundCategoryStrip = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name, image_url")
      .order("display_order")
      .then(({ data }) => setCats(data || []));
  }, []);

  if (!cats.length) return null;

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      {/* Mobile: horizontal scroll. Desktop: wrap grid. */}
      <div className="flex md:grid md:grid-cols-9 gap-3 md:gap-6 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
        {cats.map((c) => (
          <CategoryCircle
            key={c.id}
            name={c.name}
            imageUrl={c.image_url}
            onClick={() => navigate(`/category/${c.id}`)}
            className="shrink-0"
            // TODO: backend field needed for badges (e.g. discount %, "new", "trendy")
            badge={null}
          />
        ))}
      </div>
    </section>
  );
};
