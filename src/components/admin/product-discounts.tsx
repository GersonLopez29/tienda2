"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_LABEL, type Product } from "@/lib/types";

type DiscountProduct = Pick<Product, "id" | "title" | "brand" | "category" | "size" | "price" | "originalPrice" | "sold">;

export function ProductDiscounts({ products }: { products: DiscountProduct[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Record<string, { price: string; originalPrice: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const draftFor = (p: DiscountProduct) =>
    drafts[p.id] ?? { price: String(p.price), originalPrice: p.originalPrice != null ? String(p.originalPrice) : "" };

  const setDraft = (id: string, field: "price" | "originalPrice", value: string) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...draftFor(products.find((p) => p.id === id)!), ...prev[id], [field]: value } }));
  };

  const save = async (p: DiscountProduct) => {
    const draft = draftFor(p);
    setSavingId(p.id);
    setErrorId(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${p.id}/discount`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: draft.price,
          originalPrice: draft.originalPrice.trim() === "" ? null : draft.originalPrice,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorId(p.id);
        setError(data?.error ?? "No se pudo guardar el descuento");
        return;
      }
      router.refresh();
    } finally {
      setSavingId(null);
    }
  };

  const removeDiscount = (p: DiscountProduct) => {
    setDrafts((prev) => ({ ...prev, [p.id]: { price: String(p.price), originalPrice: "" } }));
  };

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <h2 className="mb-6 text-xl font-extrabold">Descuentos ({products.length})</h2>
      <div className="flex flex-col gap-3">
        {products.map((p) => {
          const draft = draftFor(p);
          const hasDiscount = draft.originalPrice.trim() !== "";
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  {p.title}
                  {p.sold && (
                    <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-[0.65rem] text-ink-faint">
                      Vendida
                    </span>
                  )}
                </p>
                <p className="text-xs text-ink-faint">
                  {p.brand} · {CATEGORY_LABEL[p.category]} · Talla {p.size}
                </p>
              </div>

              <label className="flex flex-none items-center gap-1.5 text-xs text-ink-faint">
                Antes
                <input
                  type="number"
                  min={1}
                  placeholder="Sin descuento"
                  value={draft.originalPrice}
                  onChange={(e) => setDraft(p.id, "originalPrice", e.target.value)}
                  className="w-24 rounded-lg border border-line-strong bg-surface-2 px-2.5 py-1.5 text-sm outline-none focus-visible:border-olive"
                />
              </label>

              <label className="flex flex-none items-center gap-1.5 text-xs text-ink-faint">
                Precio
                <input
                  type="number"
                  min={1}
                  value={draft.price}
                  onChange={(e) => setDraft(p.id, "price", e.target.value)}
                  className="w-24 rounded-lg border border-line-strong bg-surface-2 px-2.5 py-1.5 text-sm outline-none focus-visible:border-olive"
                />
              </label>

              <div className="flex flex-none items-center gap-2">
                {hasDiscount && (
                  <button
                    type="button"
                    onClick={() => removeDiscount(p)}
                    className="rounded-full border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-terracotta hover:text-terracotta"
                  >
                    Quitar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => save(p)}
                  disabled={savingId === p.id}
                  className="rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-surface hover:bg-olive disabled:opacity-60"
                >
                  {savingId === p.id ? "Guardando…" : "Guardar"}
                </button>
              </div>

              {errorId === p.id && error && <p className="w-full text-xs text-terracotta">{error}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
