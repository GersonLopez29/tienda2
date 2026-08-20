import Link from "next/link";
import { WhatsappIcon } from "@/components/icons";

const CONTENT = `💌 ¡Hola! Bienvenida a KyN Store,
donde tus prendas pueden tener una nueva historia 💕

Si quieres vender tu ropa con nosotras, así funciona:

1. Aceptamos de 10 a 25 prendas o accesorios en buen estado.
2. 📸 Mándanos fotos y videos claros de cada prenda para su selección al 992955792.
3. 🧾 Crea una lista (Excel o nota) con:
– Número o nombre de la prenda
– Precio mínimo y máximo 💵
(Seleccionamos el precio juntas)
4. 📦 Coordinamos el recojo o envío,
y tus prendas estarán activas por 3 semanas.
Nosotras nos encargamos de toda la gestión:
venta, atención, empaquetado y entregas tanto en Lima como en provincia 🤍

💸 La ganancia para nosotros es el 20% sobre la venta final de la prenda
y te vamos transfiriendo conforme se vendan las prendas.

Si alguna prenda no se vende,
puedes decidir si deseas recuperarla o donarla 💫

✨ Así de fácil es reLovear y darle nueva vida a tu closet 🌸`;

export default function VenderPage() {
  const whatsappHref = `https://wa.me/${process.env.ADMIN_WHATSAPP}?text=${encodeURIComponent(
    "Hola, quiero vender mi ropa en K&N'Store",
  )}`;

  return (
    <main className="min-h-screen bg-bg px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-[640px]">
        <p className="text-xs text-ink-faint">K&N&apos;Store</p>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Cómo funciona vender</h1>

        <div className="mt-6 rounded-2xl border border-line bg-surface p-6 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
          {CONTENT}
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
