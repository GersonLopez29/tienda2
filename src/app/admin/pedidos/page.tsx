import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/session";
import { getAllOrders } from "@/lib/orders";
import { AdminHeader } from "@/components/admin/admin-header";
import { OrderList } from "@/components/admin/order-list";

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/pedidos");
  if (!isAdmin(user)) redirect("/");

  const orders = await getAllOrders();
  return (
    <main className="min-h-dvh bg-bg">
      <AdminHeader title="Pedidos" />
      <OrderList orders={orders} />
    </main>
  );
}
