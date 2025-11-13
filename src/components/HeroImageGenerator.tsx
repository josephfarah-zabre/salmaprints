import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { toast } from "sonner";

export const HeroImageGenerator = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { generateImage, isGenerating } = useImageGeneration();

  const handleGenerate = async () => {
    const prompt = `Create a beautiful, modern hero background image for an e-commerce catalogue website. The image should feature:
    - Elegant product photography aesthetic with soft lighting
    - Pink and white color palette (soft pinks, blush tones)
    - Abstract geometric shapes or subtle patterns in the background
    - Modern minimalist design with ample negative space
    - Professional and clean look suitable for a shopping catalogue
    - Soft gradients from light pink to white
    - No text or logos
    - High quality, suitable for a hero section background
    - 16:9 aspect ratio, wide format
    - Conveying luxury, quality, and modern shopping experience`;

    const imageUrl = await generateImage(prompt);
    if (imageUrl) {
      setGeneratedImage(imageUrl);
      toast.success("Image generated successfully! Right-click to save it.");
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "hero-background.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card p-4 rounded-lg shadow-elegant border-2 border-primary max-w-sm">
      <h3 className="font-semibold mb-3 text-primary">Hero Image Generator</h3>
      
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full mb-3 bg-gradient-primary hover:opacity-90"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Hero Image"
        )}
      </Button>

      {generatedImage && (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border-2 border-primary">
            <img 
              src={generatedImage} 
              alt="Generated hero" 
              className="w-full h-auto"
            />
          </div>
          <Button
            onClick={downloadImage}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary-subtle"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Image
          </Button>
          <p className="text-xs text-text-tertiary">
            Right-click the image to save it, then add it to your assets folder.
          </p>
        </div>
      )}
    </div>
  );
};
