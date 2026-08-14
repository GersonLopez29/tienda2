"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { CATEGORY_LABEL, CONDITION_LABEL, type Product } from "@/lib/types";
import { ProductForm } from "@/components/admin/product-form";

export function AdminDashboard({ products }: { products: Product[] }) {
  const router = useRouter();
  const [panel, setPanel] = useState<"none" | "create" | Product>("none");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const refresh = () => {
    setPanel("none");
    router.refresh();
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setDeleteConfirmText("");
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleteConfirmText !== deleteTarget.title) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
      closeDeleteModal();
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <p className="text-xs text-ink-faint">K&N'Store</p>
            <h1 className="text-lg font-extrabold">Panel de administrador</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm font-semibold text-olive-ink hover:underline">
              Ver tienda
            </a>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="rounded-full border border-line-strong px-4 py-2 text-sm font-semibold hover:border-ink disabled:opacity-60"
            >
              {loggingOut ? "Saliendo…" : "Cerrar sesión"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
        {panel === "none" ? (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-extrabold">Prendas ({products.length})</h2>
            <button
              type="button"
              onClick={() => setPanel("create")}
              className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-surface hover:bg-olive"
            >
              <PlusIcon className="h-4 w-4" />
              Nueva prenda
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <ProductForm
              product={panel === "create" ? undefined : panel}
              onCancel={() => setPanel("none")}
              onSaved={refresh}
            />
          </div>
        )}

        {panel === "none" && (
          <div className="flex flex-col gap-3">
            {products.length === 0 && (
              <p className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center text-ink-soft">
                Todavía no hay prendas publicadas. Crea la primera con &quot;Nueva prenda&quot;.
              </p>
            )}
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"
              >
                <div className="relative h-16 w-16 flex-none overflow-hidden rounded-lg bg-surface-2">
                  {product.images[0] ? (
                    <Image src={product.images[0]} alt="" fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[0.6rem] text-ink-faint">
                      Sin foto
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{product.title}</p>
                  <p className="text-xs text-ink-faint">
                    {product.brand} · {CATEGORY_LABEL[product.category]} · Talla {product.size} ·{" "}
                    {CONDITION_LABEL[product.condition]}
                  </p>
                </div>
                <div className="flex-none text-right">
                  {product.originalPrice != null && (
                    <p className="fvnum text-xs text-ink-faint line-through">S/ {product.originalPrice}</p>
                  )}
                  <p className="fvnum text-sm font-bold">S/ {product.price}</p>
                </div>
                <div className="flex flex-none items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPanel(product)}
                    aria-label={`Editar ${product.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink-soft hover:border-olive hover:text-olive-ink"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(product)}
                    aria-label={`Eliminar ${product.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink-soft hover:border-terracotta hover:text-terracotta"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div
          role="presentation"
          onClick={(e) => e.target === e.currentTarget && closeDeleteModal()}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(18,22,20,0.55)] p-5"
        >
          <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl bg-surface p-6">
            <h3 className="text-lg font-extrabold">¿Eliminar esta prenda?</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Esta acción no se puede deshacer. Escribe{" "}
              <span className="font-bold text-ink">&quot;{deleteTarget.title}&quot;</span> para confirmar.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={deleteTarget.title}
              autoFocus
              className="mt-3 w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm outline-none focus:border-ink"
            />
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting || deleteConfirmText !== deleteTarget.title}
                className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-bold text-white hover:brightness-95 disabled:opacity-60"
              >
                {deleting ? "Eliminando…" : "Eliminar"}
              </button>
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-bold hover:border-ink"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
