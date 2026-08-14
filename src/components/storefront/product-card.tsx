import Image from "next/image";
import { BagIcon, EyeIcon } from "@/components/icons";
import { CONDITION_LABEL, type Product } from "@/lib/types";

const CONDITION_STYLE: Record<Product["condition"], string> = {
  COMO_NUEVA: "bg-olive-wash text-olive-ink",
  POCO_USO: "bg-mustard-wash text-mustard",
  VINTAGE: "bg-ink text-surface",
};

export function ProductCard({
  product,
  onAdd,
  onPreview,
}: {
  product: Product;
  onAdd: (id: string) => void;
  onPreview: (id: string) => void;
}) {
  const isOffer = product.originalPrice != null;
  const cover = product.images[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-transform duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_6px_20px_-6px_rgba(46,42,34,0.18)]">
      <div className="relative aspect-square bg-surface-2">
        {cover ? (
          <Image
            src={cover}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-faint">
            Sin foto
          </div>
        )}
        {isOffer && (
          <span className="absolute left-0 top-0 rounded-br-[10px] bg-terracotta px-2.5 py-1 text-[0.66rem] font-bold text-white">
            OFERTA
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-ink-faint">{product.brand}</p>
        <h3 className="text-[0.98rem] font-bold leading-tight text-balance">{product.title}</h3>
        <div className="mt-0.5 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-ink-soft">
            Talla {product.size}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs ${CONDITION_STYLE[product.condition]}`}>
            {CONDITION_LABEL[product.condition]}
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            {isOffer && (
              <span className="fvnum text-xs text-ink-faint line-through">
                S/ {product.originalPrice}
              </span>
            )}
            <span className="fvnum text-lg font-bold text-ink">S/ {product.price}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPreview(product.id)}
              aria-label={`Vista previa de ${product.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface text-ink-soft hover:border-ink hover:text-ink"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onAdd(product.id)}
              className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-xs font-bold text-surface hover:bg-olive"
            >
              <BagIcon className="h-3.5 w-3.5" />
              Añadir
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
