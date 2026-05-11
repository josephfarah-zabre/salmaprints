import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PromoPopup } from "./PromoPopup";

interface Popup {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
}

export const ActivePromoPopup = () => {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("promotional_popups")
        .select("id, title, subtitle, description, image_url")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1);
      const p = data?.[0];
      if (!active || !p) return;
      if (sessionStorage.getItem(`promo_dismissed_${p.id}`)) return;
      setPopup(p);
      setTimeout(() => setOpen(true), 600);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!open || !popup) return null;

  return (
    <PromoPopup
      title={popup.title}
      subtitle={popup.subtitle || undefined}
      description={popup.description || undefined}
      imageUrl={popup.image_url || undefined}
      onClose={() => {
        sessionStorage.setItem(`promo_dismissed_${popup.id}`, "1");
        setOpen(false);
      }}
    />
  );
};
