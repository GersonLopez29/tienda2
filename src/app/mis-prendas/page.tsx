import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getProductsBySeller } from "@/lib/products";
import { SellerDashboard } from "@/components/seller/seller-dashboard";
import type { Product } from "@/lib/types";

export default async function MisPrendasPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mis-prendas");

  const products = await getProductsBySeller(user.id);
  return <SellerDashboard products={products as unknown as Product[]} />;
}
