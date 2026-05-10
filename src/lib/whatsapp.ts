export function buildWhatsAppLink(product: { id: string; name: string }, language: "ar" | "en" = "ar") {
  const productPageUrl = `${window.location.origin}/product/${product.id}`;
  const greeting = language === "ar" ? "مرحباً، أنا مهتم بـ" : "Hi! I'm interested in";
  const message = `${greeting}: ${product.name}\n${productPageUrl}`;
  return `https://wa.me/message/5JHP3PKIIBIRK1?text=${encodeURIComponent(message)}`;
}
