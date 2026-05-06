import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCardProps {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  onWhatsAppClick: () => void;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const ProductCard = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onWhatsAppClick,
  isNew = false,
  isFeatured = false,
}: ProductCardProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const goToDetail = () => {
    if (id) navigate(`/product/${id}`);
  };

  return (
    <Card className="group overflow-hidden border border-border shadow-card hover:shadow-hover hover:border-primary transition-all duration-300 flex flex-col">
      <button
        type="button"
        onClick={goToDetail}
        className="relative aspect-square overflow-hidden bg-secondary block w-full focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`View ${name}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
            <span className="text-primary-foreground text-4xl font-bold opacity-30">
              {name.charAt(0)}
            </span>
          </div>
        )}
        {(isNew || isFeatured) && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {isNew && (
              <Badge className="bg-primary text-primary-foreground text-[10px]">
                {t("product.new")}
              </Badge>
            )}
            {isFeatured && (
              <Badge className="bg-primary text-primary-foreground text-[10px]">
                {t("product.featured")}
              </Badge>
            )}
          </div>
        )}
      </button>

      <CardContent className="p-2 md:p-3 flex-1">
        <button
          type="button"
          onClick={goToDetail}
          className="text-left w-full"
        >
          <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {name}
          </h3>
        </button>
        {price && (
          <p className="text-base md:text-lg font-bold text-primary mt-1">
            ${price.toFixed(2)}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-2 md:p-3 pt-0">
        <Button
          onClick={onWhatsAppClick}
          className="w-full bg-gradient-primary hover:opacity-90 transition-all"
          size="sm"
        >
          <MessageCircle className="w-3.5 h-3.5 mr-1" />
          <span className="text-xs md:text-sm">{t("product.inquire")}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
