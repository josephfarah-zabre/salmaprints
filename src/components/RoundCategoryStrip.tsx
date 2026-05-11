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
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {cats.map((c) => (
          <CategoryCircle
            key={c.id}
            name={c.name}
            imageUrl={c.image_url}
            onClick={() => navigate(`/category/${c.id}`)}
            badge={null}
          />
        ))}
      </div>
    </section>
  );
};
