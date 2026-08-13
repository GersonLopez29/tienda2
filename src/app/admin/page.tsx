import { getAllProducts } from "@/lib/products";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import type { Product } from "@/lib/types";

export default async function AdminPage() {
  const products = await getAllProducts();
  return <AdminDashboard products={products as unknown as Product[]} />;
}
