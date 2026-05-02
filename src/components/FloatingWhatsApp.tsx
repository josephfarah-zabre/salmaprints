import whatsappIcon from "@/assets/whatsapp-icon.png";

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform duration-200 drop-shadow-lg"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="w-14 h-14 md:w-16 md:h-16" />
    </a>
  );
};

export default FloatingWhatsApp;
