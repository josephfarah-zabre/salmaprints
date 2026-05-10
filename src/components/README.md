---
name: Component map
description: Top-level UI components and the backend hook/query each one consumes
type: reference
---

Built for: ishtari-style visual rebuild on top of existing WhatsApp-only flow.

| Component | Backend |
|---|---|
| `Navbar` | none (renders `SearchBar` + `LanguageToggle`) |
| `SearchBar` | `supabase.from("products"|"categories")` ilike search |
| `CategoryNavStrip` | `supabase.from("categories").select("id,name").order("display_order")` |
| `HeroCarousel` | `supabase.from("promotional_popups").select(...).eq("is_active", true)` — falls back to placeholder slides |
| `RoundCategoryStrip` | `supabase.from("categories")` ordered by display_order |
| `CategoryCircle` | none (presentational) |
| `PromoTileRow` | none (static tiles passed by parent) |
| `FeaturedProductsRail` | `supabase.from("products").eq("is_featured", true)` |
| `ProductCard` | none (parent passes data + WhatsApp handler) |
| `Footer` | hardcoded social links (IG, FB, TikTok, WhatsApp) |
| `FloatingWhatsApp` | hardcoded wa.me link |
| `Index` page | aggregates above + lists subcategories |
| `CategoryProducts` page | products + categories + subcategories by `categoryId` |
| `SubcategoryProducts` page | products by `subcategoryId` |
| `ProductDetail` page | single product by `productId`; WhatsApp inquire |

TODO (backend fields not present): category badge (% off / "trendy"), product brand, original price/discount, rating, sold count, color variants, is_express. Stub with null/false until DB is extended.
