"use client";

import Image from "next/image";
import { BagIcon, MinusIcon, PlusIcon, TrashIcon, WhatsappIcon, XIcon } from "@/components/icons";
import type { Product } from "@/lib/types";

export type CartLine = { product: Product; qty: number };

export function CartDrawer({
  open,
  lines,
  total,
  whatsappNumber,
  onClose,
  onInc,
  onDec,
  onRemove,
}: {
  open: boolean;
  lines: CartLine[];
  total: number;
  whatsappNumber: string;
  onClose: () => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const checkout = () => {
    if (!lines.length) return;
    const message = [
      "Hola! Quiero comprar estas prendas de K&N'Store:",
      ...lines.map(
        (l) => `- ${l.product.title} (Talla ${l.product.size}) x${l.qty} - S/ ${l.product.price * l.qty}`
      ),
      "",
      `Total: S/ ${total}`,
      "¿Podemos coordinar el pago y envío?",
    ].join("\n");
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener"
    );
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[90] bg-[rgba(18,22,20,0.5)] transition-opacity duration-200 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Carrito de compras"
        className={`fixed right-0 top-0 bottom-0 z-[95] flex w-full max-w-[420px] flex-col bg-surface shadow-[-16px_0_40px_rgba(0,0,0,0.25)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-dashed border-line-strong px-5 py-5">
          <h3 className="text-lg font-extrabold">Tu carrito</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-2 text-ink hover:bg-olive-wash"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-ink-soft">
              <BagIcon className="h-8 w-8 text-ink-faint" />
              <p>
                Tu carrito está vacío.
                <br />
                Explora el catálogo y añade tus piezas favoritas.
              </p>
            </div>
          ) : (
            lines.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 border-b border-line py-4">
                <div className="relative h-16 w-16 flex-none overflow-hidden rounded-[10px] bg-surface-2">
                  {product.images[0] && (
                    <Image src={product.images[0]} alt={product.title} fill sizes="64px" className="object-contain" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-tight">{product.title}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    Talla {product.size} · S/ {product.price}
                  </p>
                  <div className="mt-2.5 inline-flex items-center overflow-hidden rounded-full border border-line-strong">
                    <button
                      type="button"
                      onClick={() => onDec(product.id)}
                      aria-label="Restar unidad"
                      className="flex h-6 w-6 items-center justify-center bg-surface-2 hover:bg-olive-wash"
                    >
                      <MinusIcon className="h-3 w-3" />
                    </button>
                    <span className="fvnum min-w-6 px-1 text-center text-sm font-bold">{qty}</span>
                    <button
                      type="button"
                      onClick={() => onInc(product.id)}
                      aria-label="Sumar unidad"
                      className="flex h-6 w-6 items-center justify-center bg-surface-2 hover:bg-olive-wash"
                    >
                      <PlusIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-none flex-col items-end justify-between">
                  <span className="fvnum text-sm font-bold">S/ {product.price * qty}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    aria-label="Eliminar del carrito"
                    className="p-1 text-ink-faint hover:text-terracotta"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-dashed border-line-strong bg-surface-2 px-5 pt-4 pb-6">
            <div className="mb-3.5 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-ink-soft">Total</span>
              <span className="fvnum text-xl font-extrabold">S/ {total}</span>
            </div>
            <button
              type="button"
              onClick={checkout}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3f6c4b] py-3.5 font-bold text-white hover:brightness-95"
            >
              <WhatsappIcon className="h-4 w-4" />
              Finalizar compra vía WhatsApp
            </button>
            <p className="mt-2.5 text-center text-xs text-ink-faint">
              Se abrirá WhatsApp con tu pedido listo para enviar al vendedor.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
