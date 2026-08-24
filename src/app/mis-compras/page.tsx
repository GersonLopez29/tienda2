import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getOrdersForBuyer } from "@/lib/orders";

export default async function MisComprasPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mis-compras");

  const orders = await getOrdersForBuyer(user.id);

  return (
    <main className="min-h-dvh bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <div>
            <p className="text-xs text-ink-faint">K&N&apos;Store</p>
            <h1 className="text-lg font-extrabold">Mis compras</h1>
          </div>
          <Link href="/" className="text-sm font-semibold text-olive-ink hover:underline">
            Ver tienda
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
        <h2 className="mb-6 text-xl font-extrabold">Pedidos ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-ink-soft">
            Todavía no has iniciado ninguna compra. Cuando finalices una compra desde el carrito
            quedará registrada aquí.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-bold">Vendido por {order.seller.name}</p>
                  <p className="text-xs text-ink-faint">
                    {new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(order.createdAt)}
                  </p>
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm text-ink-soft">
                      {item.title} x{item.qty} — <span className="fvnum">S/ {item.price * item.qty}</span>
                    </p>
                  ))}
                </div>
                <p className="mt-2 text-sm font-extrabold">
                  Total: <span className="fvnum">S/ {order.total}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
