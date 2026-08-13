import { getAllProducts } from "@/lib/products";
import { Storefront } from "@/components/storefront/storefront";
import type { Product } from "@/lib/types";

export default async function HomePage() {
  const products = await getAllProducts();
  return <Storefront products={products as unknown as Product[]} />;
}
