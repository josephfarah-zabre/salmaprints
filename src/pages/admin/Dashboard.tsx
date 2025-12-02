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
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [popupDialogOpen, setPopupDialogOpen] = useState(false);
  const [popupPreviewOpen, setPopupPreviewOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [promoPopup, setPromoPopup] = useState<PromoPopup | null>(null);

  // Product form state
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [uploadingProduct, setUploadingProduct] = useState(false);

  // Category form state
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [uploadingCategory, setUploadingCategory] = useState(false);

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

    // Check if user has admin role
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
      const [productsData, categoriesData, popupData] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("promotional_popups").select("*").limit(1).single(),
      ]);

      if (productsData.error) throw productsData.error;
      if (categoriesData.error) throw categoriesData.error;

      setProducts(productsData.data || []);
      setCategories(categoriesData.data || []);
      
      if (popupData.data) {
        setPromoPopup(popupData.data);
        setPopupTitle(popupData.data.title);
        setPopupSubtitle(popupData.data.subtitle || "");
        setPopupDescription(popupData.data.description || "");
        setPopupIsActive(popupData.data.is_active);
      }
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
    setProductImageFile(null);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingProduct(true);

    try {
      let imageUrl = editingProduct?.image_url || null;

      // Upload image if a new file is selected
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
    setProductImageFile(null);
    setDialogOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingCategory(true);

    try {
      let imageUrl = null;

      // Upload image if a file is selected
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

  const handleSavePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingPopup(true);

    try {
      let imageUrl = promoPopup?.image_url;

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

      if (promoPopup) {
        const { error } = await supabase
          .from("promotional_popups")
          .update(popupData)
          .eq("id", promoPopup.id);

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
      setPopupImageFile(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save popup");
    } finally {
      setUploadingPopup(false);
    }
  };

  const togglePopupStatus = async () => {
    if (!promoPopup) return;
    
    try {
      const { error } = await supabase
        .from("promotional_popups")
        .update({ is_active: !promoPopup.is_active })
        .eq("id", promoPopup.id);

      if (error) throw error;
      toast.success(`Popup ${!promoPopup.is_active ? "activated" : "deactivated"}!`);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle popup status");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="flex gap-2">
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
        {/* Promotional Popup Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Promotional Popup</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage the promotional popup shown to visitors
                </p>
              </div>
              <div className="flex items-center gap-4">
                {promoPopup && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="popup-active">Active</Label>
                    <Switch
                      id="popup-active"
                      checked={promoPopup.is_active}
                      onCheckedChange={togglePopupStatus}
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={() => setPopupPreviewOpen(true)}
                  disabled={!promoPopup}
                >
                  Preview
                </Button>
                <Dialog open={popupDialogOpen} onOpenChange={setPopupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      {promoPopup ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {promoPopup ? "Edit Popup" : "Create Popup"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {promoPopup ? "Edit Promotional Popup" : "Create Promotional Popup"}
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
                        {promoPopup?.image_url && !popupImageFile && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Current image will be kept if no new image is uploaded
                          </p>
                        )}
                      </div>
                      <Button type="submit" className="w-full" disabled={uploadingPopup}>
                        {uploadingPopup ? "Saving..." : promoPopup ? "Update Popup" : "Create Popup"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          {promoPopup && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promoPopup.image_url && (
                  <div>
                    <img
                      src={promoPopup.image_url}
                      alt="Popup preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Title</p>
                    <p className="font-semibold">{promoPopup.title}</p>
                  </div>
                  {promoPopup.subtitle && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Subtitle</p>
                      <p>{promoPopup.subtitle}</p>
                    </div>
                  )}
                  {promoPopup.description && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Description</p>
                      <p className="text-sm">{promoPopup.description}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Status</p>
                    <p className={promoPopup.is_active ? "text-green-600 font-semibold" : "text-muted-foreground"}>
                      {promoPopup.is_active ? "✓ Active" : "✗ Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Popup Preview Dialog */}
        {popupPreviewOpen && promoPopup && (
          <PromoPopup
            title={promoPopup.title}
            subtitle={promoPopup.subtitle || undefined}
            description={promoPopup.description || undefined}
            imageUrl={promoPopup.image_url || undefined}
            onClose={() => setPopupPreviewOpen(false)}
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
                  <Select value={productCategory} onValueChange={setProductCategory}>
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
                              ({categoryProducts.length} products)
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
                      <CardContent className="pt-0">
                        {categoryProducts.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No products in this category yet.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {categoryProducts.map((product) => (
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
                            ))}
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