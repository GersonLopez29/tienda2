import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/session";
import { getAllProducts } from "@/lib/products";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProductDiscounts } from "@/components/admin/product-discounts";

export default async function AdminDiscountsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/descuentos");
  if (!isAdmin(user)) redirect("/");

  const products = await getAllProducts();
  return (
    <main className="min-h-dvh bg-bg">
      <AdminHeader title="Descuentos" />
      <ProductDiscounts products={products} />
    </main>
  );
}
