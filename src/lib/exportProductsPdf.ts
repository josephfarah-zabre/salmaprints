import jsPDF from "jspdf";

export interface ExportProduct {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category_id: string | null;
  subcategory_id: string | null;
}

export interface ExportCategory {
  id: string;
  name: string;
}

export interface ExportSubcategory {
  id: string;
  name: string;
  category_id: string;
}

export interface ExportOptions {
  scope:
    | { type: "all" }
    | { type: "category"; categoryId: string }
    | { type: "subcategory"; subcategoryId: string };
  products: ExportProduct[];
  categories: ExportCategory[];
  subcategories: ExportSubcategory[];
}

// Brand colors (RGB approximations of hsl tokens)
const PRIMARY: [number, number, number] = [44, 59, 126]; // #2C3B7E
const ACCENT: [number, number, number] = [212, 123, 155]; // #D47B9B
const TEXT_DARK: [number, number, number] = [30, 30, 40];
const TEXT_MUTED: [number, number, number] = [110, 110, 120];
const BORDER: [number, number, number] = [225, 225, 232];

// Convert image URL to base64 data URL with size constraints.
async function loadImageAsDataUrl(
  url: string,
  maxSize = 400
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) return null;
    const blob = await response.blob();

    return await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      const objectUrl = URL.createObjectURL(blob);
      img.onload = () => {
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        URL.revokeObjectURL(objectUrl);
        resolve({ dataUrl, width: w, height: h });
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };
      img.src = objectUrl;
    });
  } catch {
    return null;
  }
}

function filenameFor(opts: ExportOptions): string {
  const safe = (s: string) =>
    s.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  if (opts.scope.type === "all") return `products-all-${date}.pdf`;
  if (opts.scope.type === "category") {
    const cat = opts.categories.find((c) => c.id === opts.scope.categoryId);
    return `products-${safe(cat?.name || "category")}-${date}.pdf`;
  }
  const sub = opts.subcategories.find((s) => s.id === opts.scope.subcategoryId);
  return `products-${safe(sub?.name || "subcategory")}-${date}.pdf`;
}

function scopeTitle(opts: ExportOptions): string {
  if (opts.scope.type === "all") return "All Products";
  if (opts.scope.type === "category") {
    const cat = opts.categories.find((c) => c.id === opts.scope.categoryId);
    return cat ? `Category: ${cat.name}` : "Category";
  }
  const sub = opts.subcategories.find((s) => s.id === opts.scope.subcategoryId);
  const parent = sub ? opts.categories.find((c) => c.id === sub.category_id) : null;
  return sub
    ? `${parent ? parent.name + " · " : ""}${sub.name}`
    : "Subcategory";
}

function filterProducts(opts: ExportOptions): ExportProduct[] {
  if (opts.scope.type === "all") return opts.products;
  if (opts.scope.type === "category")
    return opts.products.filter((p) => p.category_id === opts.scope.categoryId);
  return opts.products.filter(
    (p) => p.subcategory_id === opts.scope.subcategoryId
  );
}

export async function exportProductsToPdf(opts: ExportOptions): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const products = filterProducts(opts);
  const title = scopeTitle(opts);

  // Cover header
  const drawHeader = (pageNum: number) => {
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, pageWidth, 70, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Salma Print", margin, 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Product Catalog", margin, 50);
    // Right-aligned scope
    doc.setFontSize(9);
    const scopeText = title;
    const tw = doc.getTextWidth(scopeText);
    doc.text(scopeText, pageWidth - margin - tw, 32);
    const dateStr = new Date().toLocaleDateString();
    const dw = doc.getTextWidth(dateStr);
    doc.text(dateStr, pageWidth - margin - dw, 50);
    // Accent bar
    doc.setFillColor(...ACCENT);
    doc.rect(0, 70, pageWidth, 3, "F");
  };

  const drawFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...TEXT_MUTED);
      const footer = `Page ${i} of ${pageCount}  ·  Salma Print  ·  +961 03 30 45 66`;
      const fw = doc.getTextWidth(footer);
      doc.text(footer, (pageWidth - fw) / 2, pageHeight - 20);
    }
  };

  drawHeader(1);

  // Title block
  let y = 100;
  doc.setTextColor(...PRIMARY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(title, margin, y);
  y += 10;
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(2);
  doc.line(margin, y, margin + 60, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(`${products.length} product${products.length === 1 ? "" : "s"}`, margin, y);
  y += 20;

  if (products.length === 0) {
    doc.setTextColor(...TEXT_DARK);
    doc.setFontSize(12);
    doc.text("No products found for this selection.", margin, y + 20);
    drawFooter();
    doc.save(filenameFor(opts));
    return;
  }

  // Pre-load images in parallel (cap concurrency lightly via Promise.all batches)
  const imageMap = new Map<string, { dataUrl: string; width: number; height: number } | null>();
  const batchSize = 6;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (p) => {
        if (p.image_url) {
          imageMap.set(p.id, await loadImageAsDataUrl(p.image_url));
        } else {
          imageMap.set(p.id, null);
        }
      })
    );
  }

  // Render rows
  const rowHeight = 130;
  const imgBox = 110;
  const gap = 16;

  for (const product of products) {
    if (y + rowHeight > pageHeight - 50) {
      doc.addPage();
      drawHeader(doc.getNumberOfPages());
      y = 100;
    }

    // Card background
    doc.setFillColor(252, 252, 254);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, rowHeight - 10, 6, 6, "FD");

    // Image
    const imgX = margin + 10;
    const imgY = y + 10;
    const img = imageMap.get(product.id);
    if (img) {
      const ratio = Math.min(imgBox / img.width, imgBox / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const cx = imgX + (imgBox - w) / 2;
      const cy = imgY + (imgBox - h) / 2;
      // Image background frame
      doc.setFillColor(245, 246, 250);
      doc.roundedRect(imgX, imgY, imgBox, imgBox, 4, 4, "F");
      try {
        doc.addImage(img.dataUrl, "JPEG", cx, cy, w, h);
      } catch {
        // ignore
      }
    } else {
      doc.setFillColor(245, 246, 250);
      doc.roundedRect(imgX, imgY, imgBox, imgBox, 4, 4, "F");
      doc.setTextColor(...TEXT_MUTED);
      doc.setFontSize(9);
      doc.text("No image", imgX + imgBox / 2 - 20, imgY + imgBox / 2);
    }

    // Text block
    const textX = imgX + imgBox + gap;
    const textWidth = contentWidth - imgBox - gap - 20;
    let ty = imgY + 4;

    // Category / subcategory pill
    const cat = opts.categories.find((c) => c.id === product.category_id);
    const sub = opts.subcategories.find((s) => s.id === product.subcategory_id);
    if (cat || sub) {
      const pillText = [cat?.name, sub?.name].filter(Boolean).join(" · ");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...ACCENT);
      doc.text(pillText.toUpperCase(), textX, ty + 8);
      ty += 16;
    }

    // Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...PRIMARY);
    const nameLines = doc.splitTextToSize(product.name, textWidth);
    doc.text(nameLines.slice(0, 2), textX, ty + 8);
    ty += Math.min(nameLines.length, 2) * 16 + 4;

    // Description
    if (product.description) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...TEXT_DARK);
      const descLines = doc.splitTextToSize(product.description, textWidth);
      const maxLines = 3;
      doc.text(descLines.slice(0, maxLines), textX, ty + 8);
      ty += Math.min(descLines.length, maxLines) * 12 + 4;
    }

    // Price (bottom-aligned)
    if (product.price != null) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...PRIMARY);
      const priceText = `$${Number(product.price).toFixed(2)}`;
      doc.text(priceText, textX, y + rowHeight - 22);
    }

    y += rowHeight;
  }

  drawFooter();
  doc.save(filenameFor(opts));
}
