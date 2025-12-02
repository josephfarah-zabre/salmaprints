import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PromoPopup } from "@/components/PromoPopup";

interface PromoPopup {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

const Popups = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [popupDialogOpen, setPopupDialogOpen] = useState(false);
  const [popupPreviewOpen, setPopupPreviewOpen] = useState(false);
  const [promoPopup, setPromoPopup] = useState<PromoPopup | null>(null);

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
      const { data: popupData, error } = await supabase
        .from("promotional_popups")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (popupData) {
        setPromoPopup(popupData);
        setPopupTitle(popupData.title);
        setPopupSubtitle(popupData.subtitle || "");
        setPopupDescription(popupData.description || "");
        setPopupIsActive(popupData.is_active);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Promotional Popups</h1>
        <p className="text-muted-foreground">Manage promotional popups shown to visitors</p>
      </div>

      {/* Promotional Popup Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Promotional Popup</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create and manage the promotional popup displayed on your site
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
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="popup-active-form"
                        checked={popupIsActive}
                        onCheckedChange={setPopupIsActive}
                      />
                      <Label htmlFor="popup-active-form">Activate popup immediately</Label>
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
        {!promoPopup && (
          <CardContent>
            <p className="text-center text-muted-foreground py-12">
              No promotional popup created yet. Click "Create Popup" to get started!
            </p>
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
    </div>
  );
};

export default Popups;
