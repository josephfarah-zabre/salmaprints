import { X } from "lucide-react";

interface PromoPopupProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  onClose: () => void;
}

export const PromoPopup = ({ title, subtitle, description, imageUrl, onClose }: PromoPopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="relative bg-background rounded-lg max-w-md w-full overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        {imageUrl && <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />}
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          {subtitle && <p className="text-lg text-primary mb-2">{subtitle}</p>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
    </div>
  );
};
