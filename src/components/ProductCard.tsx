import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCardProps {
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  onWhatsAppClick: () => void;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const ProductCard = ({ 
  name, 
  description, 
  price, 
  imageUrl, 
  onWhatsAppClick,
  isNew = false,
  isFeatured = false,
}: ProductCardProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <>
    <Card className="group overflow-hidden border-2 border-border shadow-card hover:shadow-hover hover:border-primary transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <button
        type="button"
        onClick={() => imageUrl && setOpen(true)}
        className="relative aspect-square overflow-hidden bg-secondary block w-full focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`View ${name}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
            <span className="text-primary-foreground text-4xl font-bold opacity-30">
              {name.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Badges */}
        {(isNew || isFeatured) && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {isNew && (
              <Badge className="bg-primary-light text-primary border-primary">
                {t("product.new")}
              </Badge>
            )}
            {isFeatured && (
              <Badge className="bg-primary-light text-primary border-primary">
                {t("product.featured")}
              </Badge>
            )}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
            {description}
          </p>
        )}
        {price && (
          <p className="text-2xl font-bold text-primary">
            ${price.toFixed(2)}
          </p>
        )}
      </CardContent>
      
      {/* Action Button */}
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={onWhatsAppClick}
          className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 hover:shadow-glow"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {t("product.inquire")}
        </Button>
      </CardFooter>
    </Card>
  );
};
