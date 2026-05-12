import { useEffect, useState } from "react";
import whatsappIcon from "@/assets/whatsapp-logo.png";

const FloatingWhatsApp = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onOverlay = (e: Event) => {
      const ce = e as CustomEvent<{ open: boolean }>;
      setHidden(!!ce.detail?.open);
    };
    window.addEventListener("mobile-overlay", onOverlay as EventListener);
    return () => {
      window.removeEventListener("mobile-overlay", onOverlay as EventListener);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed bottom-4 end-4 z-50 flex flex-col items-end gap-3"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href="https://wa.me/message/5JHP3PKIIBIRK1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message Masco Salma Print on WhatsApp"
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 px-[11px] bg-pink-500"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="w-12 h-12 object-contain rounded-full" />
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
