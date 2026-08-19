"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BagIcon, XIcon } from "@/components/icons";
import { CONDITION_LABEL, type Product } from "@/lib/types";

export function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null;
  onClose: () => void;
  onAdd: (id: string) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  const isOpen = product != null;

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(18,22,20,0.55)] p-5 transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {product && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="grid w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-[20px] bg-surface shadow-[0_20px_50px_-16px_rgba(46,42,34,0.3)] sm:grid-cols-2"
          style={{ maxHeight: "88vh" }}
        >
          <div className="relative flex flex-col items-center justify-center bg-surface-2 p-7">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface text-ink hover:border-terracotta hover:bg-terracotta hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </button>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-2">
              {product.images[activeImage] ? (
                <Image
                  src={product.images[activeImage]}
                  alt={product.title}
                  fill
                  sizes="(min-width: 640px) 45vw, 90vw"
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-ink-faint">
                  Sin foto
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Ver foto ${i + 1}`}
                    className={`relative h-14 w-14 flex-none overflow-hidden rounded-lg border-2 bg-surface-2 ${
                      i === activeImage ? "border-ink" : "border-transparent"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="56px" className="object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-4 p-7">
            <p className="text-xs text-ink-faint">
              {product.brand} · Vendido por {product.seller.name}
            </p>
            <h3 id="modal-title" className="text-2xl font-extrabold leading-tight text-balance">
              {product.title}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-ink-soft">
                Talla {product.size}
              </span>
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-ink-soft">
                {CONDITION_LABEL[product.condition]}
              </span>
              {product.sold && (
                <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-surface">
                  Vendido
                </span>
              )}
            </div>
            <div>
              {product.originalPrice != null && (
                <span className="fvnum mr-2 text-base text-ink-faint line-through">
                  S/ {product.originalPrice}
                </span>
              )}
              <span className="fvnum text-2xl font-extrabold text-ink">S/ {product.price}</span>
            </div>

            {Object.keys(product.measurements).length > 0 && (
              <div>
                <h4 className="mb-2 text-xs tracking-wide text-ink-faint uppercase">Medidas</h4>
                <table className="fvnum w-full border-collapse text-sm">
                  <tbody>
                    {Object.entries(product.measurements).map(([label, value]) => (
                      <tr key={label} className="border-b border-dashed border-line-strong">
                        <td className="py-1.5 text-ink-soft">{label}</td>
                        <td className="py-1.5 text-right font-bold">{value} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div>
              <h4 className="mb-2 text-xs tracking-wide text-ink-faint uppercase">Material</h4>
              <p className="text-sm leading-relaxed text-ink-soft">{product.material}</p>
            </div>
            <div>
              <h4 className="mb-2 text-xs tracking-wide text-ink-faint uppercase">Historia y estado</h4>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">{product.story}</p>
            </div>
            <div>
              <h4 className="mb-2 text-xs tracking-wide text-ink-faint uppercase">Cómo combinarla</h4>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">{product.pairing}</p>
            </div>

            <button
              type="button"
              onClick={() => onAdd(product.id)}
              disabled={product.sold}
              className="mt-1 flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-3.5 text-sm font-bold text-surface hover:bg-olive disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink"
            >
              <BagIcon className="h-4 w-4" />
              {product.sold ? "Ya vendida" : "Añadir al carrito"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
