"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BagIcon,
  DropletIcon,
  FilterIcon,
  InstagramIcon,
  LeafIcon,
  RulerIcon,
  SearchIcon,
  TiktokIcon,
  TruckIcon,
} from "@/components/icons";
import { CATEGORY_LABEL, CONDITION_LABEL, type Product } from "@/lib/types";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductModal } from "@/components/storefront/product-modal";
import { CartDrawer, type CartLine } from "@/components/storefront/cart-drawer";
import { useFavorites } from "@/lib/use-favorites";

const WHATSAPP_NUMBER = "51941809900";

const CATEGORIES = ["Todos", "Hombre", "Mujer", "Unisex", "Ofertas", "Favoritos"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const SIZES = ["S", "M", "L"];
const CONDITIONS: Product["condition"][] = ["COMO_NUEVA", "POCO_USO", "VINTAGE"];
const CONDITION_CHIP_LABEL: Record<Product["condition"], string> = {
  COMO_NUEVA: "Como nueva",
  POCO_USO: "Poco uso",
  VINTAGE: "Vintage",
};

export function Storefront({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<CategoryFilter>("Todos");
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [conditions, setConditions] = useState<Set<Product["condition"]>>(new Set());
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      if (category === "Ofertas" && p.originalPrice == null) return false;
      if (category === "Favoritos" && !favorites.has(p.id)) return false;
      if (
        category !== "Todos" &&
        category !== "Ofertas" &&
        category !== "Favoritos" &&
        CATEGORY_LABEL[p.category] !== category
      )
        return false;
      if (sizes.size && !sizes.has(p.size)) return false;
      if (conditions.size && !conditions.has(p.condition)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!(p.title + " " + p.brand).toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, category, sizes, conditions, search, favorites]);

  const cartLines: CartLine[] = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const product = products.find((p) => p.id === id);
          return product ? { product, qty } : null;
        })
        .filter((l): l is CartLine => l != null),
    [cart, products]
  );
  const cartTotal = cartLines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const cartQty = cartLines.reduce((sum, l) => sum + l.qty, 0);

  const addToCart = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const incInCart = addToCart;
  const decInCart = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return c;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  const removeFromCart = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });

  const toggleSize = (size: string) =>
    setSizes((s) => {
      const next = new Set(s);
      if (next.has(size)) next.delete(size);
      else next.add(size);
      return next;
    });
  const toggleCondition = (cond: Product["condition"]) =>
    setConditions((s) => {
      const next = new Set(s);
      if (next.has(cond)) next.delete(cond);
      else next.add(cond);
      return next;
    });
  const clearFilters = () => {
    setSizes(new Set());
    setConditions(new Set());
  };
  const activeFilterCount = sizes.size + conditions.size;

  const previewProduct = products.find((p) => p.id === previewId) ?? null;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-5 py-3.5">
            <span className="font-[Arial_Black] text-2xl font-extrabold text-olive-ink">
              K&N'Store
            </span>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-2.5 sm:flex"
            >
              <SearchIcon className="h-4 w-4 flex-none text-ink-faint" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca por prenda o marca — ej. Levi's, denim…"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-ink-faint"
              />
            </form>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                aria-expanded={filterOpen}
                className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface-2 px-4 text-sm font-semibold hover:bg-olive-wash hover:border-olive-soft"
              >
                <FilterIcon className="h-4 w-4" />
                Filtrar
                {activeFilterCount > 0 && (
                  <span className="fvnum flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-olive px-1 text-[0.68rem] font-bold text-surface">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label="Abrir carrito"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-2 hover:bg-olive-wash hover:border-olive-soft"
              >
                <BagIcon className="h-[19px] w-[19px]" />
                {cartQty > 0 && (
                  <span className="fvnum absolute -right-1.5 -top-1.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-terracotta px-1 text-[0.68rem] font-bold text-white shadow-[0_0_0_2px_var(--surface)]">
                    {cartQty}
                  </span>
                )}
              </button>
            </div>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mb-3 flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-2.5 sm:hidden"
          >
            <SearchIcon className="h-4 w-4 flex-none text-ink-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Busca por prenda o marca…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-faint"
            />
          </form>
          <nav aria-label="Categorías" className="flex items-center gap-1.5 overflow-x-auto border-t border-line py-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                aria-selected={category === cat}
                className={`flex-none rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                  category === cat
                    ? "bg-olive font-bold text-white"
                    : "text-ink-soft hover:bg-olive-wash hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
        <div
          className="overflow-hidden border-b border-line bg-surface-2 transition-[max-height] duration-300"
          style={{ maxHeight: filterOpen ? 340 : 0 }}
        >
          <div className="mx-auto flex max-w-[1280px] flex-wrap gap-7 px-4 pt-4 pb-6 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-2.5">
              <span className="text-[0.7rem] tracking-wide text-ink-faint uppercase">Talla</span>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    aria-pressed={sizes.has(s)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
                      sizes.has(s)
                        ? "border-olive bg-olive text-white"
                        : "border-line-strong bg-surface text-ink-soft hover:border-olive-soft"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-[0.7rem] tracking-wide text-ink-faint uppercase">Estado de la prenda</span>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCondition(c)}
                    aria-pressed={conditions.has(c)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
                      conditions.has(c)
                        ? "border-olive bg-olive text-white"
                        : "border-line-strong bg-surface text-ink-soft hover:border-olive-soft"
                    }`}
                  >
                    {CONDITION_CHIP_LABEL[c]}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto self-end py-2 text-sm font-bold text-olive-ink underline underline-offset-4"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:gap-16 lg:px-10">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-olive-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-olive" />
              <span className="text-xs tracking-wide uppercase">Curaduría de segunda mano</span>
            </p>
            <h1 className="text-4xl leading-tight font-extrabold text-balance sm:text-5xl lg:text-6xl">
              Prendas con historia,
              <br />
              estilo <em className="not-italic text-olive">sin repetir</em>
            </h1>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
              Seleccionamos vintage, streetwear y básicos de segunda mano en buen estado — cada
              pieza revisada, medida y lista para su segunda vida. Menos ropa nueva, más carácter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a
                href="#catalogo"
                className="rounded-full bg-mustard px-6 py-3.5 text-sm font-bold text-white hover:brightness-95"
              >
                Ver catálogo
              </a>
              <a
                href="#catalogo"
                onClick={() => setCategory("Ofertas")}
                className="rounded-full border border-olive px-6 py-3.5 text-sm font-bold text-olive-ink hover:bg-olive-wash"
              >
                Novedades
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-7">
              <Stat value={String(products.length)} label="Prendas activas" />
              <Stat value="100%" label="Revisadas a mano" />
              <Stat value="0" label="Prendas nuevas producidas" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[300px] rounded-[20px] border border-line bg-surface p-5 shadow-[0_20px_50px_-16px_rgba(46,42,34,0.3)]">
              <div className="relative aspect-square overflow-hidden rounded-[14px] bg-gradient-to-br from-mustard-wash to-mustard">
                {products[0]?.images[0] && (
                  <Image
                    src={products[0].images[0]}
                    alt={products[0].title}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                )}
              </div>
              <p className="mt-4 text-xs tracking-wide text-ink-faint">
                {products[0]?.brand ?? "ReFit Studio"}
              </p>
              <h3 className="text-lg font-extrabold">{products[0]?.title ?? "Aún sin prendas"}</h3>
              {products[0] && (
                <>
                  <p className="fvnum mt-2.5 text-xl font-extrabold">S/ {products[0].price}</p>
                  <span className="mt-2.5 inline-block rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-surface">
                    {CONDITION_LABEL[products[0].condition]}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface-2 py-8">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-10">
          <TrustItem
            icon={<DropletIcon className="h-6 w-6 text-olive-ink" />}
            title="Lavadas y desinfectadas"
            body="Cada prenda pasa por limpieza profesional antes de publicarse."
          />
          <TrustItem
            icon={<RulerIcon className="h-6 w-6 text-olive-ink" />}
            title="Tallas y medidas exactas"
            body="Medidas reales en cm, no solo la etiqueta de fábrica."
          />
          <TrustItem
            icon={<TruckIcon className="h-6 w-6 text-olive-ink" />}
            title="Envíos a todo el país"
            body="Coordinamos el envío directo por WhatsApp al confirmar tu compra."
          />
          <TrustItem
            icon={<LeafIcon className="h-6 w-6 text-olive-ink" />}
            title="Cuidado del planeta"
            body="Cada prenda reutilizada es una menos fabricada desde cero."
          />
        </div>
      </section>

      <section id="catalogo" className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <h2 className="text-2xl font-extrabold sm:text-3xl">Catálogo</h2>
            <span className="text-sm text-ink-faint">
              {visibleProducts.length} {visibleProducts.length === 1 ? "prenda" : "prendas"}
            </span>
          </div>
          {visibleProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-3.5 py-16 text-center text-ink-soft">
              <SearchIcon className="h-8 w-8 text-ink-faint" />
              <p>
                No encontramos prendas con esos filtros.
                <br />
                Prueba ajustar la búsqueda o limpiar los filtros.
              </p>
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  setSearch("");
                  setCategory("Todos");
                }}
                className="rounded-full border border-line-strong px-6 py-3 text-sm font-bold hover:border-ink"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={addToCart}
                  onPreview={setPreviewId}
                  isFavorite={favorites.has(p.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-ink py-14 text-stone-wash">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-10">
          <div>
            <p className="text-xl font-extrabold text-[#f2ecdf]">K&N'Store</p>
            <p className="mt-2.5 max-w-[34ch] text-sm leading-relaxed text-[#a89e8c]">
              Ropa de segunda mano seleccionada pieza por pieza. Vintage, streetwear y casual —
              moda con menos impacto y más personalidad.
            </p>
            <div className="mt-4 flex gap-2.5">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[#f2ecdf] hover:border-olive hover:bg-olive-wash hover:text-olive-ink"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[#f2ecdf] hover:border-olive hover:bg-olive-wash hover:text-olive-ink"
              >
                <TiktokIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>
          <div>
            <h5 className="mb-4 text-xs tracking-wide text-[#a89e8c] uppercase">Tienda</h5>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a href="#catalogo" className="text-[#cfc6b4] hover:text-[#f2ecdf] hover:underline">
                  Catálogo completo
                </a>
              </li>
              <li>
                <button
                  onClick={() => setCategory("Ofertas")}
                  className="text-[#cfc6b4] hover:text-[#f2ecdf] hover:underline"
                >
                  Ofertas
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCategory("Hombre")}
                  className="text-[#cfc6b4] hover:text-[#f2ecdf] hover:underline"
                >
                  Hombre
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCategory("Mujer")}
                  className="text-[#cfc6b4] hover:text-[#f2ecdf] hover:underline"
                >
                  Mujer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCategory("Unisex")}
                  className="text-[#cfc6b4] hover:text-[#f2ecdf] hover:underline"
                >
                  Unisex
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 text-xs tracking-wide text-[#a89e8c] uppercase">Visítanos y paga con</h5>
            <p className="text-sm text-[#a89e8c]">Av. Ejemplo 123, local 4 — Lima, Perú (referencial, edítalo).</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Yape", "Plin", "Visa", "Mastercard"].map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-bold text-[#f2ecdf]"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-11 max-w-[1280px] border-t border-white/10 px-4 pt-5 text-center text-xs text-[#8a8272] sm:px-6 lg:px-10">
          © {new Date().getFullYear()} K&N'Store — hecho con ropa que ya tenía una historia.
          <Link href="/admin" className="ml-2 underline underline-offset-4 hover:text-[#cfc6b4]">
            Panel admin
          </Link>
        </div>
      </footer>

      <ProductModal product={previewProduct} onClose={() => setPreviewId(null)} onAdd={addToCart} />
      <CartDrawer
        open={cartOpen}
        lines={cartLines}
        total={cartTotal}
        whatsappNumber={WHATSAPP_NUMBER}
        onClose={() => setCartOpen(false)}
        onInc={incInCart}
        onDec={decInCart}
        onRemove={removeFromCart}
      />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <b className="fvnum block text-2xl font-extrabold text-olive-ink">{value}</b>
      <span className="text-[0.7rem] tracking-wide text-ink-faint uppercase">{label}</span>
    </div>
  );
}

function TrustItem({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-none">{icon}</div>
      <div>
        <h4 className="text-sm font-bold">{title}</h4>
        <p className="mt-0.5 text-[0.8rem] leading-snug text-ink-soft">{body}</p>
      </div>
    </div>
  );
}
