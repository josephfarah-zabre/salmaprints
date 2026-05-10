import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
  onClick: () => void;
  className?: string;
}

/**
 * Legacy CategoryCard kept as a tile (rectangular). New round version lives in CategoryCircle.
 */
export const CategoryCard = ({ name, imageUrl, onClick, className }: CategoryCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group bg-card rounded-2xl overflow-hidden border border-border flex flex-col",
        "transition-all duration-300 hover:border-primary hover:shadow-lg hover:-translate-y-0.5",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className,
      )}
    >
      <div className="aspect-square w-full overflow-hidden bg-surface-peach">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-primary/40 text-5xl font-bold">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="p-2 md:p-3 text-center">
        <h3 className="text-xs sm:text-sm md:text-base font-semibold leading-snug group-hover:text-primary transition-colors break-words">
          {name}
        </h3>
      </div>
    </button>
  );
};
