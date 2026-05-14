import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface HeroSlide {
  id: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

export const HeroSlidesManager = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);

  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [subtitleAr, setSubtitleAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      toast.error("Failed to load hero slides");
      return;
    }
    setSlides((data as HeroSlide[]) || []);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setTitleEn("");
    setTitleAr("");
    setSubtitleEn("");
    setSubtitleAr("");
    setDescriptionEn("");
    setDescriptionAr("");
    setIsActive(true);
    setImageFile(null);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditing(slide);
    setTitleEn(slide.title_en);
    setTitleAr(slide.title_ar);
    setSubtitleEn(slide.subtitle_en || "");
    setSubtitleAr(slide.subtitle_ar || "");
    setDescriptionEn(slide.description_en || "");
    setDescriptionAr(slide.description_ar || "");
    setIsActive(slide.is_active);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = editing?.image_url || null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("hero-slides")
          .upload(path, imageFile);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage
          .from("hero-slides")
          .getPublicUrl(path);
        imageUrl = publicUrl;
      }

      const payload = {
        title_en: titleEn,
        title_ar: titleAr,
        subtitle_en: subtitleEn || null,
        subtitle_ar: subtitleAr || null,
        description_en: descriptionEn || null,
        description_ar: descriptionAr || null,
        image_url: imageUrl,
        is_active: isActive,
      };

      if (editing) {
        const { error } = await supabase
          .from("hero_slides")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
        toast.success("Slide updated!");
      } else {
        const nextOrder = slides.length
          ? Math.max(...slides.map((s) => s.display_order)) + 1
          : 0;
        const { error } = await supabase
          .from("hero_slides")
          .insert({ ...payload, display_order: nextOrder });
        if (error) throw error;
        toast.success("Slide created!");
      }

      setDialogOpen(false);
      resetForm();
      fetchSlides();
    } catch (err: any) {
      toast.error(err.message || "Failed to save slide");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === slide.id ? { ...s, is_active: !s.is_active } : s)),
    );
    const { error } = await supabase
      .from("hero_slides")
      .update({ is_active: !slide.is_active })
      .eq("id", slide.id);
    if (error) {
      toast.error(error.message);
      fetchSlides();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("hero_slides").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Slide deleted!");
    fetchSlides();
  };

  const move = async (slide: HeroSlide, dir: -1 | 1) => {
    const sorted = [...slides].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((s) => s.id === slide.id);
    const target = idx + dir;
    if (target < 0 || target >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[target];
    setSlides((prev) =>
      prev.map((s) =>
        s.id === a.id
          ? { ...s, display_order: b.display_order }
          : s.id === b.id
          ? { ...s, display_order: a.display_order }
          : s,
      ),
    );
    const [r1, r2] = await Promise.all([
      supabase.from("hero_slides").update({ display_order: b.display_order }).eq("id", a.id),
      supabase.from("hero_slides").update({ display_order: a.display_order }).eq("id", b.id),
    ]);
    if (r1.error || r2.error) {
      toast.error("Failed to reorder");
      fetchSlides();
    }
  };

  const sortedSlides = [...slides].sort((a, b) => a.display_order - b.display_order);

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <CardTitle>Hero Carousel Slides</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Add, edit, reorder, and toggle the slides shown in the homepage hero carousel.
            </p>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Slide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Hero Slide" : "Add Hero Slide"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>Title (English) *</Label>
                    <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
                  </div>
                  <div>
                    <Label>Title (Arabic) *</Label>
                    <Input
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      required
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>Subtitle (English)</Label>
                    <Input value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)} />
                  </div>
                  <div>
                    <Label>Subtitle (Arabic)</Label>
                    <Input
                      value={subtitleAr}
                      onChange={(e) => setSubtitleAr(e.target.value)}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>Description (English)</Label>
                    <Textarea
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Description (Arabic)</Label>
                    <Textarea
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      rows={2}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>Image (optional)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                    {editing?.image_url && !imageFile && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Current image will be kept if no new image is uploaded.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={isActive} onCheckedChange={setIsActive} id="slide-active" />
                    <Label htmlFor="slide-active">Active</Label>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Saving..." : editing ? "Update Slide" : "Create Slide"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sortedSlides.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hero slides yet. Add your first one!
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSlides.map((slide, i) => (
              <div
                key={slide.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                {slide.image_url && (
                  <img
                    src={slide.image_url}
                    alt={slide.title_en}
                    className="w-24 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{slide.title_en}</h3>
                      <p className="text-sm text-muted-foreground truncate" dir="rtl">
                        {slide.title_ar}
                      </p>
                      {slide.subtitle_en && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {slide.subtitle_en}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Switch
                        checked={slide.is_active}
                        onCheckedChange={() => toggleActive(slide)}
                      />
                      <span
                        className={`text-xs font-semibold ${
                          slide.is_active ? "text-green-600" : "text-muted-foreground"
                        }`}
                      >
                        {slide.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={i === 0}
                    onClick={() => move(slide, -1)}
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={i === sortedSlides.length - 1}
                    onClick={() => move(slide, 1)}
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(slide)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Slide</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(slide.id)}
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
  );
};
