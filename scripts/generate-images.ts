import { supabase } from "@/integrations/supabase/client";

async function generateCategoryImages() {
  const categories = [
    { id: "acd79acf-30b3-4dcf-aeef-480a4282a7b1", name: "Electronics", description: "Latest electronic devices and gadgets" },
    { id: "6699bccd-9085-4fbf-b09b-b16212eaeab2", name: "Furniture", description: "Modern and stylish furniture pieces" },
    { id: "c916050c-c7e9-45a9-8048-223849e6b51c", name: "Clothing", description: "Fashion and apparel collection" },
    { id: "4c7f2eff-be45-4187-ad81-dda485e7736f", name: "Home & Garden", description: "Home decor and garden essentials" }
  ];

  for (const category of categories) {
    console.log(`Generating image for ${category.name}...`);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-category-images", {
        body: {
          categoryId: category.id,
          categoryName: category.name,
          description: category.description,
        },
      });

      if (error) {
        console.error(`Error for ${category.name}:`, error);
      } else {
        console.log(`✓ Generated image for ${category.name}`);
      }
      
      // Wait 2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed for ${category.name}:`, error);
    }
  }
  
  console.log("All images generated!");
}

// Run it
generateCategoryImages();
