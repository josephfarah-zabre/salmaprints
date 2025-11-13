import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async (prompt: string): Promise<string | null> => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-hero-image", {
        body: { prompt },
      });

      if (error) {
        console.error("Error generating image:", error);
        toast.error("Failed to generate image. Please try again.");
        return null;
      }

      if (!data?.imageUrl) {
        toast.error("No image was generated. Please try again.");
        return null;
      }

      return data.imageUrl;
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateImage, isGenerating };
};
