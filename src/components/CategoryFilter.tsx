import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12 animate-fade-in">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onSelectCategory(null)}
        className={cn(
          "transition-all duration-300 border-2",
          selectedCategory === null 
            ? "bg-gradient-primary hover:opacity-90 shadow-elegant" 
            : "border-border hover:border-primary hover:bg-primary-subtle"
        )}
      >
        All Products
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "transition-all duration-300 border-2",
            selectedCategory === category.id
              ? "bg-gradient-primary hover:opacity-90 shadow-elegant"
              : "border-border hover:border-primary hover:bg-primary-subtle"
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};
