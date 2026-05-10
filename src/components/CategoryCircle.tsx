import { cn } from "@/lib/utils";

interface CategoryCircleProps {
  name: string;
  imageUrl?: string | null;
  badge?: { text: string; tone?: "accent" | "primary" | "yellow" } | null;
  size?: "sm" | "md";
  onClick: () => void;
  className?: string;
}

export const CategoryCircle = ({
  name,
  imageUrl,
  badge,
  size = "md",
  onClick,
  className,
}: CategoryCircleProps) => {
  const dim = size === "md" ? "w-24 h-24 md:w-32 md:h-32" : "w-16 h-16 md:w-20 md:h-20";
  return (
    <button
      onClick={onClick}
      className={cn("group flex flex-col items-center gap-2 focus:outline-none", className)}
    >
      <div className={cn("category-circle transition-transform group-hover:-translate-y-1", dim)}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl md:text-3xl font-extrabold text-primary/40">
            {name.charAt(0)}
          </span>
        )}
        {badge && (
          <span
            className={cn(
              "absolute top-1 left-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm",
              badge.tone === "yellow" && "bg-badge-yellow text-foreground",
              badge.tone === "accent" && "bg-accent text-accent-foreground",
              (!badge.tone || badge.tone === "primary") && "bg-primary text-primary-foreground"
            )}
          >
            {badge.text}
          </span>
        )}
      </div>
      <span className="text-xs md:text-sm font-semibold text-foreground text-center max-w-[6rem] md:max-w-[8rem] line-clamp-2 group-hover:text-primary transition-colors">
        {name}
      </span>
    </button>
  );
};
