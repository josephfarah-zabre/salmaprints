import whatsappIcon from "@/assets/whatsapp-icon.png";

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/message/5JHP3PKIIBIRK1"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Masco Salma Print on WhatsApp"
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-transform hover:scale-110"
    >
      <img
        src={whatsappIcon}
        alt="WhatsApp"
        className="object-contain rounded-full"
        style={{ width: "64px", height: "64px" }}
      />
    </a>
  );
};

export default FloatingWhatsApp;
