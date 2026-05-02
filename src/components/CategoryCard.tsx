import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
  onClick: () => void;
  className?: string;
}

export const CategoryCard = ({
  name,
  description,
  imageUrl,
  productCount,
  onClick,
  className,
}: CategoryCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group bg-card rounded-lg overflow-hidden border-2 border-border",
        "transition-all duration-300",
        "hover:border-primary hover:bg-primary-subtle hover:shadow-hover hover:-translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
    >
      {/* Category Image */}
      <div className="aspect-square w-full overflow-hidden bg-secondary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
            <span className="text-primary-foreground text-5xl font-bold opacity-40">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      {/* Category Info - hidden on mobile */}
      <div className="hidden md:block p-5 text-left">
        <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors truncate">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-text-secondary line-clamp-2 mb-2">
            {description}
          </p>
        )}
        {productCount !== undefined && (
          <p className="text-xs text-text-tertiary">
            {productCount} {productCount === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>
    </button>
  );
};
