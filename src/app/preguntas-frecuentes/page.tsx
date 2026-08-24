import Link from "next/link";

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "¿Cómo compro una prenda?",
    a: "Agrega la prenda al carrito y da clic en \"Finalizar compra\". Te abrimos WhatsApp directo con el vendedor para coordinar el pago y el envío.",
  },
  {
    q: "¿Cómo pago?",
    a: "Aceptamos Yape, Plin, Visa y Mastercard — se coordina directo con el vendedor por WhatsApp al momento de la compra.",
  },
  {
    q: "¿Hacen envíos a todo el Perú?",
    a: "Sí, coordinamos envío a Lima y provincia. El costo y tiempo de entrega se acuerda por WhatsApp según tu ubicación.",
  },
  {
    q: "¿Puedo devolver o cambiar una prenda?",
    a: "Al ser ropa única de segunda mano, no hay cambio de talla en la misma prenda. Pero si la prenda no corresponde a la descripción o fotos publicadas, escríbenos por WhatsApp dentro de las 48 horas de recibida y coordinamos una solución (cambio, crédito o reembolso según el caso).",
  },
  {
    q: "¿Cómo sé qué talla pedir?",
    a: (
      <>
        Cada prenda tiene sus medidas exactas en su ficha. También puedes revisar nuestra{" "}
        <Link href="/guia-tallas" className="font-bold text-olive-ink underline underline-offset-2">
          guía de tallas
        </Link>{" "}
        como referencia general.
      </>
    ),
  },
  {
    q: "¿En qué estado está la ropa?",
    a: "Cada prenda pasa por revisión antes de publicarse y se etiqueta como Como nueva, Poco uso o Vintage según su condición real.",
  },
  {
    q: "¿Cómo vendo mi ropa con ustedes?",
    a: (
      <>
        Revisa el proceso completo en{" "}
        <Link href="/vender" className="font-bold text-olive-ink underline underline-offset-2">
          Cómo funciona vender
        </Link>
        .
      </>
    ),
  },
];

export const metadata = {
  title: "Preguntas frecuentes — K&N'Store",
  description: "Envíos, pagos, cambios y devoluciones — todo lo que necesitas saber antes de comprar.",
};

export default function FAQPage() {
  return (
    <main className="min-h-dvh bg-bg px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-[640px]">
        <p className="text-xs text-ink-faint">K&N&apos;Store</p>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Preguntas frecuentes</h1>

        <div className="mt-6 flex flex-col gap-3">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-line bg-surface p-5 open:pb-5"
            >
              <summary className="cursor-pointer list-none text-sm font-bold marker:content-none">
                <span className="flex items-center justify-between gap-3">
                  {q}
                  <span className="flex-none text-ink-faint transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
