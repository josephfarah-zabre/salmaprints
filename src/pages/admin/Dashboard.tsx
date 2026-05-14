import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Edit, ChevronDown, ChevronRight, FileDown, ArrowUp, ArrowDown } from "lucide-react";
import { exportProductsToPdf } from "@/lib/exportProductsPdf";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PromoPopup } from "@/components/PromoPopup";
import { Switch } from "@/components/ui/switch";
import { HeroSlidesManager } from "@/components/admin/HeroSlidesManager";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category_id: string | null;
  subcategory_id: string | null;
  image_url: string | null;
  display_order?: number;
}

interface Category {
  id: string;
  name: string;
  display_order?: number;
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

interface PromoPopup {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [popupDialogOpen, setPopupDialogOpen] = useState(false);
  const [popupPreviewOpen, setPopupPreviewOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [promoPopups, setPromoPopups] = useState<PromoPopup[]>([]);
  const [editingPopup, setEditingPopup] = useState<PromoPopup | null>(null);

  // Banner ticker text
  const [bannerSettingsId, setBannerSettingsId] = useState<string | null>(null);
  const [bannerTextEn, setBannerTextEn] = useState("");
  const [bannerTextAr, setBannerTextAr] = useState("");
  const [savingBanner, setSavingBanner] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("id, banner_text_en, banner_text_ar")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setBannerSettingsId(data.id);
        setBannerTextEn(data.banner_text_en || "");
        setBannerTextAr(data.banner_text_ar || "");
      });
  }, []);

  const handleSaveBanner = async () => {
    setSavingBanner(true);
    try {
      if (bannerSettingsId) {
        const { error } = await supabase
          .from("site_settings")
          .update({ banner_text_en: bannerTextEn, banner_text_ar: bannerTextAr })
          .eq("id", bannerSettingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("site_settings")
          .insert({ banner_text_en: bannerTextEn, banner_text_ar: bannerTextAr })
          .select("id")
          .single();
        if (error) throw error;
        setBannerSettingsId(data.id);
      }
      toast.success("Banner text updated!");
    } catch (e: any) {
      toast.error(e.message || "Failed to save banner");
    } finally {
      setSavingBanner(false);
    }
  };

  // Product form state
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSubcategory, setProductSubcategory] = useState<string>("none");
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [uploadingProduct, setUploadingProduct] = useState(false);

  // Category form state
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [uploadingCategory, setUploadingCategory] = useState(false);

  // Subcategory form state
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [subcategoryParent, setSubcategoryParent] = useState<Category | null>(null);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [savingSubcategory, setSavingSubcategory] = useState(false);

  // Rename category
  const [renameCategoryDialogOpen, setRenameCategoryDialogOpen] = useState(false);
  const [renamingCategory, setRenamingCategory] = useState<Category | null>(null);
  const [renameCategoryName, setRenameCategoryName] = useState("");
  const [savingCategoryRename, setSavingCategoryRename] = useState(false);

  // Export PDF
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportScopeType, setExportScopeType] = useState<"all" | "category" | "subcategory">("all");
  const [exportCategoryId, setExportCategoryId] = useState<string>("");
  const [exportSubcategoryId, setExportSubcategoryId] = useState<string>("");
  const [exporting, setExporting] = useState(false);

  const handleExportPdf = async () => {
    try {
      setExporting(true);
      let scope: Parameters<typeof exportProductsToPdf>[0]["scope"];
      if (exportScopeType === "category") {
        if (!exportCategoryId) {
          toast.error("Please select a category");
          setExporting(false);
          return;
        }
        scope = { type: "category", categoryId: exportCategoryId };
      } else if (exportScopeType === "subcategory") {
        if (!exportSubcategoryId) {
          toast.error("Please select a subcategory");
          setExporting(false);
          return;
        }
        scope = { type: "subcategory", subcategoryId: exportSubcategoryId };
      } else {
        scope = { type: "all" };
      }
      await exportProductsToPdf({
        scope,
        products,
        categories,
        subcategories,
      });
      toast.success("PDF exported");
      setExportDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  // Popup form state
  const [popupTitle, setPopupTitle] = useState("");
  const [popupSubtitle, setPopupSubtitle] = useState("");
  const [popupDescription, setPopupDescription] = useState("");
  const [popupImageFile, setPopupImageFile] = useState<File | null>(null);
  const [popupIsActive, setPopupIsActive] = useState(false);
  const [uploadingPopup, setUploadingPopup] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (!roleData || roleData.role !== "admin") {
      toast.error("You don't have admin access");
      navigate("/");
    }
  };

  const fetchData = async () => {
    try {
      const [productsData, categoriesData, subcategoriesData, popupsData] = await Promise.all([
        supabase.from("products").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("subcategories").select("*").order("display_order"),
        supabase.from("promotional_popups").select("*").order("created_at", { ascending: false }),
      ]);

      if (productsData.error) throw productsData.error;
      if (categoriesData.error) throw categoriesData.error;
      if (subcategoriesData.error) throw subcategoriesData.error;
      if (popupsData.error) throw popupsData.error;

      setProducts(productsData.data || []);
      setCategories(categoriesData.data || []);
      setSubcategories(subcategoriesData.data || []);
      setPromoPopups(popupsData.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const resetProductForm = () => {
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductCategory("");
    setProductSubcategory("none");
    setProductImageFile(null);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingProduct(true);

    try {
      let imageUrl = editingProduct?.image_url || null;

      if (productImageFile) {
        const fileExt = productImageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, productImageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const productData = {
        name: productName,
        description: productDescription || null,
        price: productPrice ? parseFloat(productPrice) : null,
        category_id: productCategory || null,
        subcategory_id: productSubcategory && productSubcategory !== "none" ? productSubcategory : null,
        image_url: imageUrl,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast.success("Product updated!");
      } else {
        const { error } = await supabase.from("products").insert(productData);

        if (error) throw error;
        toast.success("Product added!");
      }

      setDialogOpen(false);
      resetProductForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setUploadingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductDescription(product.description || "");
    setProductPrice(product.price?.toString() || "");
    setProductCategory(product.category_id || "");
    setProductSubcategory(product.subcategory_id || "none");
    setProductImageFile(null);
    setDialogOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingCategory(true);

    try {
      let imageUrl = null;

      if (categoryImageFile) {
        const fileExt = categoryImageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('category-images')
          .upload(filePath, categoryImageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('category-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("categories").insert({
        name: categoryName,
        description: categoryDescription || null,
        image_url: imageUrl,
      });

      if (error) throw error;
      toast.success("Category added!");
      setCategoryDialogOpen(false);
      setCategoryName("");
      setCategoryDescription("");
      setCategoryImageFile(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add category");
    } finally {
      setUploadingCategory(false);
    }
  };

  const openSubcategoryDialog = (category: Category) => {
    setSubcategoryParent(category);
    setSubcategoryName("");
    setSubcategoryDialogOpen(true);
  };

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcategoryParent) return;
    setSavingSubcategory(true);
    try {
      const { error } = await supabase.from("subcategories").insert({
        name: subcategoryName,
        category_id: subcategoryParent.id,
      });
      if (error) throw error;
      toast.success("Subcategory added!");
      setSubcategoryDialogOpen(false);
      setSubcategoryName("");
      setSubcategoryParent(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add subcategory");
    } finally {
      setSavingSubcategory(false);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    try {
      const { error } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", subcategoryId);
      if (error) throw error;
      toast.success("Subcategory deleted!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete subcategory");
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(p => p.category_id === categoryId);
  };

  const getSubcategoriesByCategory = (categoryId: string) => {
    return subcategories.filter(s => s.category_id === categoryId);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;
      toast.success("Category deleted!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const openRenameCategory = (category: Category) => {
    setRenamingCategory(category);
    setRenameCategoryName(category.name);
    setRenameCategoryDialogOpen(true);
  };

  const handleRenameCategory = async () => {
    if (!renamingCategory) return;
    const trimmed = renameCategoryName.trim();
    if (!trimmed) {
      toast.error("Category name cannot be empty");
      return;
    }
    setSavingCategoryRename(true);
    try {
      const { error } = await supabase
        .from("categories")
        .update({ name: trimmed })
        .eq("id", renamingCategory.id);
      if (error) throw error;
      toast.success("Category updated!");
      setRenameCategoryDialogOpen(false);
      setRenamingCategory(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    } finally {
      setSavingCategoryRename(false);
    }
  };

  const swapCategoryOrder = async (a: Category, b: Category) => {
    const aOrder = (a as any).display_order ?? 0;
    const bOrder = (b as any).display_order ?? 0;
    // optimistic
    setCategories(prev => prev.map(c => c.id === a.id ? { ...c, display_order: bOrder } : c.id === b.id ? { ...c, display_order: aOrder } : c).sort((x, y) => ((x as any).display_order ?? 0) - ((y as any).display_order ?? 0)));
    try {
      const [r1, r2] = await Promise.all([
        supabase.from("categories").update({ display_order: bOrder }).eq("id", a.id),
        supabase.from("categories").update({ display_order: aOrder }).eq("id", b.id),
      ]);
      if (r1.error || r2.error) throw r1.error || r2.error;
    } catch (e: any) {
      toast.error(e.message || "Failed to reorder");
      fetchData();
    }
  };

  const moveCategory = async (categoryId: string, dir: -1 | 1) => {
    const sorted = [...categories].sort((a, b) => ((a as any).display_order ?? 0) - ((b as any).display_order ?? 0));
    const idx = sorted.findIndex(c => c.id === categoryId);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= sorted.length) return;

    const orders = sorted.map(c => (c as any).display_order ?? 0);
    const hasDupes = new Set(orders).size !== orders.length;
    if (hasDupes) {
      const normalized = sorted.map((c, i) => ({ ...c, display_order: (i + 1) * 10 }));
      setCategories(normalized);
      try {
        await Promise.all(normalized.map(c =>
          supabase.from("categories").update({ display_order: (c as any).display_order }).eq("id", c.id)
        ));
      } catch (e: any) {
        toast.error(e.message || "Failed to set order");
        return fetchData();
      }
      swapCategoryOrder(normalized[idx], normalized[target]);
    } else {
      swapCategoryOrder(sorted[idx], sorted[target]);
    }
  };

  const swapProductOrder = async (a: Product, b: Product) => {
    const aOrder = a.display_order ?? 0;
    const bOrder = b.display_order ?? 0;
    setProducts(prev => prev.map(p => p.id === a.id ? { ...p, display_order: bOrder } : p.id === b.id ? { ...p, display_order: aOrder } : p));
    try {
      const [r1, r2] = await Promise.all([
        supabase.from("products").update({ display_order: bOrder }).eq("id", a.id),
        supabase.from("products").update({ display_order: aOrder }).eq("id", b.id),
      ]);
      if (r1.error || r2.error) throw r1.error || r2.error;
    } catch (e: any) {
      toast.error(e.message || "Failed to reorder");
      fetchData();
    }
  };

  const moveProduct = async (productId: string, categoryId: string, dir: -1 | 1) => {
    const list = getProductsByCategory(categoryId);
    const idx = list.findIndex(p => p.id === productId);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= list.length) return;

    // Normalize if there are duplicate display_order values (e.g. all 0)
    const orders = list.map(p => p.display_order ?? 0);
    const hasDupes = new Set(orders).size !== orders.length;
    if (hasDupes) {
      const normalized = list.map((p, i) => ({ ...p, display_order: (i + 1) * 10 }));
      setProducts(prev => prev.map(p => {
        const match = normalized.find(n => n.id === p.id);
        return match ? match : p;
      }));
      try {
        await Promise.all(normalized.map(p =>
          supabase.from("products").update({ display_order: p.display_order }).eq("id", p.id)
        ));
      } catch (e: any) {
        toast.error(e.message || "Failed to set order");
        return fetchData();
      }
      swapProductOrder(normalized[idx], normalized[target]);
    } else {
      swapProductOrder(list[idx], list[target]);
    }
  };

  const handleEditPopup = (popup: PromoPopup) => {
    setEditingPopup(popup);
    setPopupTitle(popup.title);
    setPopupSubtitle(popup.subtitle || "");
    setPopupDescription(popup.description || "");
    setPopupIsActive(popup.is_active);
    setPopupImageFile(null);
    setPopupDialogOpen(true);
  };

  const resetPopupForm = () => {
    setEditingPopup(null);
    setPopupTitle("");
    setPopupSubtitle("");
    setPopupDescription("");
    setPopupIsActive(false);
    setPopupImageFile(null);
  };

  const handleSavePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingPopup(true);

    try {
      let imageUrl = editingPopup?.image_url;

      if (popupImageFile) {
        const fileExt = popupImageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("popup-images")
          .upload(filePath, popupImageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("popup-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const popupData = {
        title: popupTitle,
        subtitle: popupSubtitle || null,
        description: popupDescription || null,
        image_url: imageUrl,
        is_active: popupIsActive,
      };

      if (editingPopup) {
        const { error } = await supabase
          .from("promotional_popups")
          .update(popupData)
          .eq("id", editingPopup.id);

        if (error) throw error;
        toast.success("Popup updated!");
      } else {
        const { error } = await supabase
          .from("promotional_popups")
          .insert(popupData);

        if (error) throw error;
        toast.success("Popup created!");
      }

      setPopupDialogOpen(false);
      resetPopupForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save popup");
    } finally {
      setUploadingPopup(false);
    }
  };

  const togglePopupStatus = async (popup: PromoPopup) => {
    setPromoPopups(prev =>
      prev.map(p =>
        p.id === popup.id
          ? { ...p, is_active: !p.is_active }
          : p
      )
    );

    try {
      const { error } = await supabase
        .from("promotional_popups")
        .update({ is_active: !popup.is_active })
        .eq("id", popup.id);

      if (error) throw error;
      toast.success(`Popup ${!popup.is_active ? "activated" : "deactivated"}!`);
    } catch (error: any) {
      setPromoPopups(prev =>
        prev.map(p =>
          p.id === popup.id
            ? { ...p, is_active: popup.is_active }
            : p
        )
      );
      toast.error(error.message || "Failed to toggle popup status");
    }
  };

  const handleDeletePopup = async (popupId: string) => {
    try {
      const { error } = await supabase
        .from("promotional_popups")
        .delete()
        .eq("id", popupId);

      if (error) throw error;
      toast.success("Popup deleted!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete popup");
    }
  };

  // Subcategories filtered by currently selected product category
  const productSubcategoryOptions = subcategories.filter(
    s => s.category_id === productCategory
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            <Button variant="outline" size="sm" className="sm:size-default" onClick={() => setExportDialogOpen(true)}>
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" className="sm:size-default" onClick={() => navigate("/admin/voting")}>
              Voting
            </Button>
            <Button variant="outline" size="sm" className="sm:size-default" onClick={() => navigate("/")}>
              Catalogue
            </Button>
            <Button variant="outline" size="sm" className="sm:size-default" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Hero Carousel Slides */}
        <HeroSlidesManager />

        {/* Banner Ticker Text */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Promotional Banner Ticker</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Edit the scrolling promotional text shown under the navigation bar.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="banner-en">English text</Label>
              <Textarea
                id="banner-en"
                value={bannerTextEn}
                onChange={(e) => setBannerTextEn(e.target.value)}
                rows={2}
                placeholder="Use • to separate items"
              />
            </div>
            <div>
              <Label htmlFor="banner-ar">Arabic text</Label>
              <Textarea
                id="banner-ar"
                value={bannerTextAr}
                onChange={(e) => setBannerTextAr(e.target.value)}
                rows={2}
                dir="rtl"
                placeholder="استخدم • للفصل بين العناصر"
              />
            </div>
            <Button onClick={handleSaveBanner} disabled={savingBanner}>
              {savingBanner ? "Saving..." : "Save Banner Text"}
            </Button>
          </CardContent>
        </Card>

        {/* Promotional Popups Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <CardTitle>Promotional Popups</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage promotional popups shown to visitors
                </p>
              </div>
              <Dialog open={popupDialogOpen} onOpenChange={(open) => {
                setPopupDialogOpen(open);
                if (!open) resetPopupForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Popup
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPopup ? "Edit Promotional Popup" : "Create Promotional Popup"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSavePopup} className="space-y-4">
                    <div>
                      <Label htmlFor="popup-title">Title *</Label>
                      <Input
                        id="popup-title"
                        value={popupTitle}
                        onChange={(e) => setPopupTitle(e.target.value)}
                        required
                        placeholder="Special Offer!"
                      />
                    </div>
                    <div>
                      <Label htmlFor="popup-subtitle">Subtitle</Label>
                      <Input
                        id="popup-subtitle"
                        value={popupSubtitle}
                        onChange={(e) => setPopupSubtitle(e.target.value)}
                        placeholder="Limited Time Only"
                      />
                    </div>
                    <div>
                      <Label htmlFor="popup-description">Description</Label>
                      <Textarea
                        id="popup-description"
                        value={popupDescription}
                        onChange={(e) => setPopupDescription(e.target.value)}
                        rows={4}
                        placeholder="Get 20% off all products this week..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="popup-image">Image</Label>
                      <Input
                        id="popup-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPopupImageFile(e.target.files?.[0] || null)}
                      />
                      {editingPopup?.image_url && !popupImageFile && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Current image will be kept if no new image is uploaded
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="popup-is-active"
                        checked={popupIsActive}
                        onCheckedChange={setPopupIsActive}
                      />
                      <Label htmlFor="popup-is-active">Active</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={uploadingPopup}>
                      {uploadingPopup ? "Saving..." : editingPopup ? "Update Popup" : "Create Popup"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {promoPopups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No promotional popups yet. Create your first one!
              </div>
            ) : (
              <div className="space-y-4">
                {promoPopups.map((popup) => (
                  <div
                    key={popup.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    {popup.image_url && (
                      <img
                        src={popup.image_url}
                        alt={popup.title}
                        className="w-full h-32 sm:w-24 sm:h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">{popup.title}</h3>
                          {popup.subtitle && (
                            <p className="text-sm text-muted-foreground truncate">{popup.subtitle}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Switch
                            checked={popup.is_active}
                            onCheckedChange={() => togglePopupStatus(popup)}
                          />
                          <span className={`text-xs sm:text-sm font-semibold ${popup.is_active ? "text-green-600" : "text-muted-foreground"}`}>
                            {popup.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      {popup.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {popup.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPopupPreviewOpen(true);
                          setEditingPopup(popup);
                        }}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPopup(popup)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Popup</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this promotional popup? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePopup(popup.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popup Preview Dialog */}
        {popupPreviewOpen && editingPopup && (
          <PromoPopup
            title={editingPopup.title}
            subtitle={editingPopup.subtitle || undefined}
            description={editingPopup.description || undefined}
            imageUrl={editingPopup.image_url || undefined}
            onClose={() => {
              setPopupPreviewOpen(false);
              setEditingPopup(null);
            }}
          />
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetProductForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={productCategory}
                    onValueChange={(v) => {
                      setProductCategory(v);
                      setProductSubcategory("none");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {productCategory && productSubcategoryOptions.length > 0 && (
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select value={productSubcategory} onValueChange={setProductSubcategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— None —</SelectItem>
                        {productSubcategoryOptions.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label htmlFor="imageFile">Product Image or Video</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setProductImageFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  {editingProduct?.image_url && !productImageFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current media will be kept if no new file is selected
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-gradient-primary" disabled={uploadingProduct}>
                  {uploadingProduct ? "Uploading..." : (editingProduct ? "Update Product" : "Add Product")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Textarea
                    id="categoryDescription"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    rows={3}
                    placeholder="Short description of the category"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryImageFile">Category Image</Label>
                  <Input
                    id="categoryImageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCategoryImageFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an image for this category (JPG, PNG, WEBP)
                  </p>
                </div>
                <Button type="submit" className="w-full bg-gradient-primary" disabled={uploadingCategory}>
                  {uploadingCategory ? "Uploading..." : "Add Category"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Subcategory Dialog */}
        <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Add Subcategory{subcategoryParent ? ` to "${subcategoryParent.name}"` : ""}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveSubcategory} className="space-y-4">
              <div>
                <Label htmlFor="subcategoryName">Subcategory Name</Label>
                <Input
                  id="subcategoryName"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  required
                  placeholder="e.g. Business Cards"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary" disabled={savingSubcategory}>
                {savingSubcategory ? "Saving..." : "Add Subcategory"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Categories with Products */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No categories yet. Add your first category!
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category, catIndex) => {
              const categoryProducts = getProductsByCategory(category.id);
              const categorySubcategories = getSubcategoriesByCategory(category.id);
              const isExpanded = expandedCategories.has(category.id);

              return (
                <Card key={category.id} className="overflow-hidden">
                  <Collapsible
                    open={isExpanded}
                    onOpenChange={() => toggleCategory(category.id)}
                  >
                  <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-primary shrink-0" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-primary shrink-0" />
                            )}
                            <CardTitle className="text-base sm:text-xl truncate">{category.name}</CardTitle>
                            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                              ({categoryProducts.length} products · {categorySubcategories.length} subcategories)
                            </span>
                            <span className="text-xs text-muted-foreground sm:hidden shrink-0">
                              ({categoryProducts.length}/{categorySubcategories.length})
                            </span>
                          </div>
                          <div className="flex items-center gap-1 self-end sm:self-auto">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={(e) => { e.stopPropagation(); moveCategory(category.id, -1); }}
                            disabled={catIndex === 0}
                            aria-label="Move category up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={(e) => { e.stopPropagation(); moveCategory(category.id, 1); }}
                            disabled={catIndex === categories.length - 1}
                            aria-label="Move category down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              openRenameCategory(category);
                            }}
                            aria-label="Edit category name"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-10 sm:w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{category.name}"? This will also remove all products in this category. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                        {/* Subcategories section */}
                        <div className="border rounded-lg p-4 bg-secondary/30">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                              Subcategories
                            </h4>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openSubcategoryDialog(category)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Subcategory
                            </Button>
                          </div>
                          {categorySubcategories.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No subcategories yet.
                            </p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {categorySubcategories.map((sub) => {
                                const subProductCount = products.filter(
                                  p => p.subcategory_id === sub.id
                                ).length;
                                return (
                                  <div
                                    key={sub.id}
                                    className="flex items-center gap-2 bg-background border rounded-full pl-3 pr-1 py-1"
                                  >
                                    <span className="text-sm font-medium">{sub.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      ({subProductCount})
                                    </span>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Subcategory</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Delete "{sub.name}"? Products in this subcategory will remain but lose their subcategory link.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteSubcategory(sub.id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Products list */}
                        {categoryProducts.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No products in this category yet.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {categoryProducts.map((product, prodIndex) => {
                              const subName = product.subcategory_id
                                ? subcategories.find(s => s.id === product.subcategory_id)?.name
                                : null;
                              return (
                                <div
                                  key={product.id}
                                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                                >
                                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    {product.image_url && (
                                      /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(product.image_url) ? (
                                        <video
                                          src={product.image_url}
                                          className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded shrink-0"
                                          muted
                                          playsInline
                                        />
                                      ) : (
                                        <img
                                          src={product.image_url}
                                          alt={product.name}
                                          className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded shrink-0"
                                        />
                                      )
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold truncate">{product.name}</h3>
                                      {subName && (
                                        <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1">
                                          {subName}
                                        </span>
                                      )}
                                      <p className="text-sm text-muted-foreground line-clamp-1">
                                        {product.description}
                                      </p>
                                      {product.price && (
                                        <p className="text-primary font-semibold mt-1">
                                          ${product.price.toFixed(2)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:shrink-0">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => moveProduct(product.id, category.id, -1)}
                                      disabled={prodIndex === 0}
                                      aria-label="Move product up"
                                    >
                                      <ArrowUp className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => moveProduct(product.id, category.id, 1)}
                                      disabled={prodIndex === categoryProducts.length - 1}
                                      aria-label="Move product down"
                                    >
                                      <ArrowDown className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditProduct(product)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeleteProduct(product.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={renameCategoryDialogOpen} onOpenChange={setRenameCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rename-category">Category Name</Label>
              <Input
                id="rename-category"
                value={renameCategoryName}
                onChange={(e) => setRenameCategoryName(e.target.value)}
                placeholder="Enter new category name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRenameCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRenameCategory} disabled={savingCategoryRename}>
                {savingCategoryRename ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Products as PDF</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Scope</Label>
              <Select
                value={exportScopeType}
                onValueChange={(v: "all" | "category" | "subcategory") => {
                  setExportScopeType(v);
                  setExportCategoryId("");
                  setExportSubcategoryId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All products</SelectItem>
                  <SelectItem value="category">By category</SelectItem>
                  <SelectItem value="subcategory">By subcategory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {exportScopeType === "category" && (
              <div>
                <Label>Category</Label>
                <Select value={exportCategoryId} onValueChange={setExportCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({getProductsByCategory(c.id).length})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {exportScopeType === "subcategory" && (
              <>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={exportCategoryId}
                    onValueChange={(v) => {
                      setExportCategoryId(v);
                      setExportSubcategoryId("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {exportCategoryId && (
                  <div>
                    <Label>Subcategory</Label>
                    <Select value={exportSubcategoryId} onValueChange={setExportSubcategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubcategoriesByCategory(exportCategoryId).map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                        {getSubcategoriesByCategory(exportCategoryId).length === 0 && (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No subcategories
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExportPdf} disabled={exporting}>
                {exporting ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
