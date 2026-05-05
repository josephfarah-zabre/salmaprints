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
  imageUrl,
  onClick,
  className,
}: CategoryCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group bg-card rounded-lg overflow-hidden border-2 border-border flex flex-col",
        "transition-all duration-300",
        "hover:border-primary hover:bg-primary-subtle hover:shadow-hover hover:-translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
    >
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

      <div className="p-2 md:p-4 text-center">
        <h3 className="text-xs sm:text-sm md:text-base font-semibold leading-snug group-hover:text-primary transition-colors break-words">
          {name}
        </h3>
      </div>
    </button>
  );
};
