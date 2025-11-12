import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface ProductCardProps {
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  onWhatsAppClick: () => void;
}

export const ProductCard = ({ name, description, price, imageUrl, onWhatsAppClick }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-secondary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
            <span className="text-primary-foreground text-4xl font-bold opacity-30">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
        )}
        {price && (
          <p className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ${price.toFixed(2)}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onWhatsAppClick}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Inquire on WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};