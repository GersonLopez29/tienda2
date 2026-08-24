import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { getCurrentUser } from "@/lib/session";
import { getSellerRatingSummary, getReviewsForSeller, getMyReviewForSeller } from "@/lib/reviews";
import { CONDITION_LABEL, type Product } from "@/lib/types";
import { WhatsappIcon } from "@/components/icons";
import { ShareButton } from "@/components/storefront/share-button";
import { StarRating } from "@/components/storefront/star-rating";
import { ReviewForm } from "@/components/storefront/review-form";

export async function generateMetadata({
  params,
}: PageProps<"/producto/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Prenda no encontrada — K&N'Store" };

  return {
    title: `${product.title} — K&N'Store`,
    description: product.story.slice(0, 160),
    openGraph: product.images[0]
      ? { images: [{ url: product.images[0] }] }
      : undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/producto/[id]">) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [user, ratingSummary, reviews] = await Promise.all([
    getCurrentUser(),
    getSellerRatingSummary(product.sellerId),
    getReviewsForSeller(product.sellerId),
  ]);
  const myReview = user ? await getMyReviewForSeller(product.sellerId, user.id) : null;

  const whatsappHref = `https://wa.me/${product.seller.whatsapp}?text=${encodeURIComponent(
    `Hola ${product.seller.name}! Me interesa esta prenda: ${product.title} (S/ ${product.price})`
  )}`;

  return (
    <main className="min-h-dvh bg-bg">
      <div className="mx-auto max-w-[1000px] px-4 py-6 sm:px-6">
        <Link href="/" className="text-sm font-semibold text-olive-ink hover:underline">
          ← Volver a la tienda
        </Link>
      </div>
      <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-8 px-4 pb-16 sm:grid-cols-2 sm:px-6">
        <Gallery product={product as unknown as Product} />
        <div className="flex min-w-0 flex-col gap-4">
          <p className="text-xs text-ink-faint">{product.brand}</p>
          <h1 className="text-2xl font-extrabold leading-tight text-balance sm:text-3xl">
            {product.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
            <span>Vendido por {product.seller.name}</span>
            {ratingSummary.count > 0 && (
              <span className="flex items-center gap-1">
                <StarRating value={ratingSummary.avg} />
                <span className="fvnum">
                  {ratingSummary.avg.toFixed(1)} ({ratingSummary.count})
                </span>
              </span>
            )}
          </div>
          <ShareButton title={product.title} />
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

          {Object.keys(product.measurements as Record<string, number>).length > 0 && (
            <div>
              <h2 className="mb-2 text-xs tracking-wide text-ink-faint uppercase">Medidas</h2>
              <table className="fvnum w-full border-collapse text-sm">
                <tbody>
                  {Object.entries(product.measurements as Record<string, number>).map(
                    ([label, value]) => (
                      <tr key={label} className="border-b border-dashed border-line-strong">
                        <td className="py-1.5 text-ink-soft">{label}</td>
                        <td className="py-1.5 text-right font-bold">{value} cm</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div>
            <h2 className="mb-2 text-xs tracking-wide text-ink-faint uppercase">Material</h2>
            <p className="text-sm leading-relaxed text-ink-soft">{product.material}</p>
          </div>
          <div>
            <h2 className="mb-2 text-xs tracking-wide text-ink-faint uppercase">Historia y estado</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">{product.story}</p>
          </div>
          <div>
            <h2 className="mb-2 text-xs tracking-wide text-ink-faint uppercase">Cómo combinarla</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">{product.pairing}</p>
          </div>

          {reviews.length > 0 && (
            <div>
              <h2 className="mb-2 text-xs tracking-wide text-ink-faint uppercase">
                Reseñas del vendedor
              </h2>
              <div className="flex flex-col gap-3">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-line bg-surface-2 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold">{r.author.name}</span>
                      <StarRating value={r.rating} size="0.8em" />
                    </div>
                    {r.comment && <p className="mt-1 text-xs text-ink-soft">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {user && user.id !== product.sellerId && (
            <ReviewForm
              sellerId={product.sellerId}
              initialRating={myReview?.rating ?? 0}
              initialComment={myReview?.comment ?? ""}
            />
          )}

          {product.sold ? (
            <span className="mt-1 flex items-center justify-center rounded-full bg-surface-2 px-4 py-3.5 text-sm font-bold text-ink-faint">
              Ya vendida
            </span>
          ) : (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-3.5 text-sm font-bold text-surface hover:bg-olive"
            >
              <WhatsappIcon className="h-4 w-4" />
              Consultar por WhatsApp
            </a>
          )}
        </div>
      </div>
    </main>
  );
}

function Gallery({ product }: { product: Product }) {
  const cover = product.images[0];
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-2">
        {cover ? (
          <Image
            src={cover}
            alt={product.title}
            fill
            sizes="(min-width: 640px) 45vw, 90vw"
            className="object-contain"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-faint">Sin foto</div>
        )}
      </div>
      {product.images.length > 1 && (
        <div className="flex gap-2">
          {product.images.slice(1).map((src) => (
            <div key={src} className="relative h-16 w-16 flex-none overflow-hidden rounded-lg bg-surface-2">
              <Image src={src} alt="" fill sizes="64px" className="object-contain" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
