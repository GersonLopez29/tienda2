import Link from "next/link";
import { UploadIcon, TagIcon, WhatsappIcon } from "@/components/icons";

const STEPS = [
  {
    icon: UploadIcon,
    title: "Regístrate y sube tus prendas",
    body: "Crea tu cuenta, agrega fotos, talla, estado y precio de lo que quieras vender.",
  },
  {
    icon: TagIcon,
    title: "La publicamos en la tienda",
    body: "Tu prenda aparece en el catálogo de K&N'Store para que compradores la encuentren.",
  },
  {
    icon: WhatsappIcon,
    title: "Coordinas la venta por WhatsApp",
    body: "Cuando alguien compra, te contacta directo por WhatsApp para coordinar entrega y pago.",
  },
];

export default function VenderPage() {
  const whatsappHref = `https://wa.me/${process.env.ADMIN_WHATSAPP}?text=${encodeURIComponent(
    "Hola, quiero vender mi ropa en K&N'Store",
  )}`;

  return (
    <main className="min-h-screen bg-bg px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-[640px]">
        <p className="text-xs text-ink-faint">K&N&apos;Store</p>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Cómo funciona vender</h1>
        <p className="mt-3 text-ink-soft">
          Dale segunda vida a la ropa que ya no usas. Así de simple es publicar y vender en la
          tienda.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-mustard/15 text-mustard">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">
                  {i + 1}. {title}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm font-bold">Comisión</p>
          <p className="mt-1 text-sm text-ink-soft">
            Cobramos una comisión del 20% sobre el precio de venta cuando tu prenda se vende. El
            resto es para ti.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/registro"
            className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-surface hover:bg-olive"
          >
            Crear cuenta y vender
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-bold hover:border-ink"
          >
            <WhatsappIcon className="h-4 w-4" />
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
