import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PromoPopupProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  onClose: () => void;
}

export const PromoPopup = ({
  title,
  subtitle,
  description,
  imageUrl,
  onClose,
}: PromoPopupProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    // Remember that user dismissed the popup (lasts for session)
    sessionStorage.setItem("promo-popup-dismissed", "true");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        {imageUrl && (
          <div className="w-full h-64 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {title}
            </DialogTitle>
            {subtitle && (
              <DialogDescription className="text-lg font-semibold text-muted-foreground">
                {subtitle}
              </DialogDescription>
            )}
          </DialogHeader>
          
          {description && (
            <p className="text-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
