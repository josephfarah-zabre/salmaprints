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
import { LogOut, Plus, Trash2, Edit, ChevronDown, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PromoPopup } from "@/components/PromoPopup";
import { Switch } from "@/components/ui/switch";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category_id: string | null;
  subcategory_id: string | null;
  image_url: string | null;
}

interface Category {
  id: string;
  name: string;
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
        supabase.from("products").select("*").order("created_at", { ascending: false }),
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/voting")}>
              Voting Management
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              View Catalogue
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Promotional Popups Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
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
                  <Button>
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
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    {popup.image_url && (
                      <img
                        src={popup.image_url}
                        alt={popup.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{popup.title}</h3>
                          {popup.subtitle && (
                            <p className="text-sm text-muted-foreground">{popup.subtitle}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={popup.is_active}
                            onCheckedChange={() => togglePopupStatus(popup)}
                          />
                          <span className={`text-sm font-semibold ${popup.is_active ? "text-green-600" : "text-muted-foreground"}`}>
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
                    <div className="flex gap-2">
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
        <div className="flex gap-4 mb-8">
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetProductForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
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
                  <Label htmlFor="imageFile">Product Image</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProductImageFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  {editingProduct?.image_url && !productImageFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current image will be kept if no new file is selected
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
              <Button variant="outline">
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
            {categories.map((category) => {
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
                      <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-primary" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-primary" />
                            )}
                            <CardTitle className="text-xl">{category.name}</CardTitle>
                            <span className="text-sm text-muted-foreground">
                              ({categoryProducts.length} products · {categorySubcategories.length} subcategories)
                            </span>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 space-y-6">
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
                            {categoryProducts.map((product) => {
                              const subName = product.subcategory_id
                                ? subcategories.find(s => s.id === product.subcategory_id)?.name
                                : null;
                              return (
                                <div
                                  key={product.id}
                                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                                >
                                  <div className="flex items-center gap-4 flex-1">
                                    {product.image_url && (
                                      <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <h3 className="font-semibold">{product.name}</h3>
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
                                  <div className="flex gap-2">
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
    </div>
  );
};

export default Dashboard;
