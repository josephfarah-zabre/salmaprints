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
  price,
  imageUrl,
  onWhatsAppClick,
  isNew,
  isFeatured,
}: ProductCardProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const goToDetail = () => id && navigate(`/product/${id}`);

  return (
    <Card className="group overflow-hidden border border-border rounded-xl bg-card shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col h-[240px] md:h-[320px]">
      <button
        type="button"
        onClick={goToDetail}
        className="relative basis-[70%] shrink-0 overflow-hidden bg-secondary block w-full focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`View ${name}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <span className="text-primary/40 text-4xl font-bold">{name.charAt(0)}</span>
          </div>
        )}

        {isNew && (
          <Badge className="absolute top-2 left-2 rtl:left-auto rtl:right-2 bg-badge-green-bg text-badge-green-fg border-0 text-[10px] font-bold rounded-md">
            {t("product.new")}
          </Badge>
        )}
        {isFeatured && !isNew && (
          <Badge className="absolute top-2 left-2 rtl:left-auto rtl:right-2 bg-accent text-accent-foreground border-0 text-[10px] font-bold rounded-md">
            {t("product.featured")}
          </Badge>
        )}
      </button>

      <CardContent className="p-2 md:p-3 basis-[30%] flex-1 flex flex-col justify-between min-h-0">
        <button type="button" onClick={goToDetail} className="text-left rtl:text-right w-full">
          <h3 className="font-semibold text-[11px] md:text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {name}
          </h3>
        </button>
        {price != null && (
          <div className="mt-1 md:mt-2 flex items-center justify-between">
            <span className="price text-primary text-base md:text-2xl">
              <span className="currency">$</span>
              {Number.isInteger(price) ? price : price.toFixed(2)}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-2 md:p-3 pt-0">
        <Button
          onClick={onWhatsAppClick}
          className="w-full min-w-0 px-2 py-1 h-8 md:h-9 text-xs md:text-sm rounded-full inline-flex items-center justify-center gap-1 bg-primary hover:bg-primary-dark text-primary-foreground"
          aria-label={language === "ar" ? "استفسر عبر واتساب" : "Inquire on WhatsApp"}
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span className="hidden md:inline truncate font-semibold">{t("product.inquire")}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
