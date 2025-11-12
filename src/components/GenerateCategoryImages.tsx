import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface GenerateCategoryImagesProps {
  categories: Category[];
  onImagesGenerated: () => void;
}

export const GenerateCategoryImages = ({ categories, onImagesGenerated }: GenerateCategoryImagesProps) => {
  const [generating, setGenerating] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>("");

  const generateImages = async () => {
    setGenerating(true);
    
    for (const category of categories) {
      try {
        setCurrentCategory(category.name);
        toast.info(`Generating image for ${category.name}...`);

        const { data, error } = await supabase.functions.invoke("generate-category-images", {
          body: {
            categoryId: category.id,
            categoryName: category.name,
            description: category.description,
          },
        });

        if (error) throw error;

        console.log(`Generated image for ${category.name}:`, data);
        toast.success(`Image generated for ${category.name}`);
        
        // Small delay between generations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error: any) {
        console.error(`Error generating image for ${category.name}:`, error);
        toast.error(`Failed to generate image for ${category.name}: ${error.message}`);
      }
    }

    setGenerating(false);
    setCurrentCategory("");
    onImagesGenerated();
    toast.success("All category images generated!");
  };

  return (
    <div className="mb-6">
      <Button
        onClick={generateImages}
        disabled={generating}
        className="bg-gradient-primary"
      >
        <Wand2 className="w-4 h-4 mr-2" />
        {generating 
          ? `Generating${currentCategory ? ` for ${currentCategory}` : ''}...` 
          : "Generate Category Images with AI"}
      </Button>
    </div>
  );
};
