import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import whatsappIcon from "@/assets/whatsapp-icon.png";

const FloatingWhatsApp = () => {
  const [showTop, setShowTop] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    const onOverlay = (e: Event) => {
      const ce = e as CustomEvent<{ open: boolean }>;
      setHidden(!!ce.detail?.open);
    };
    window.addEventListener("mobile-overlay", onOverlay as EventListener);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mobile-overlay", onOverlay as EventListener);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed bottom-4 end-4 z-50 flex flex-col items-end gap-3"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:bg-muted transition-all animate-fade-in"
        >
          <ArrowUp className="w-5 h-5 text-primary" />
        </button>
      )}
      <a
        href="https://wa.me/message/5JHP3PKIIBIRK1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message Masco Salma Print on WhatsApp"
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-white transition-transform hover:scale-110"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="w-12 h-12 object-contain rounded-full" />
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
