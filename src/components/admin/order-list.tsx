type Order = {
  id: string;
  total: number;
  createdAt: Date;
  buyer: { name: string; email: string; whatsapp: string };
  seller: { name: string };
  items: { id: string; title: string; price: number; qty: number }[];
};

export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <h2 className="mb-6 text-xl font-extrabold">Pedidos ({orders.length})</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-ink-faint">Nadie ha hecho clic en "Finalizar compra" todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold">{order.buyer.name}</p>
                  <p className="text-xs text-ink-faint">
                    {order.buyer.email} · {order.buyer.whatsapp}
                  </p>
                </div>
                <div className="text-right">
                  <p className="fvnum text-sm font-bold">S/ {order.total}</p>
                  <p className="text-xs text-ink-faint">
                    {order.createdAt.toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" })}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold text-olive-ink">Vendedor: {order.seller.name}</p>
              <ul className="mt-2 flex flex-col gap-0.5">
                {order.items.map((item) => (
                  <li key={item.id} className="text-xs text-ink-soft">
                    {item.title} × {item.qty} — S/ {item.price * item.qty}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
