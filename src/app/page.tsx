import { getAllProducts } from "@/lib/products";
import { getCurrentUser, isAdmin } from "@/lib/session";
import { Storefront } from "@/components/storefront/storefront";
import type { Product } from "@/lib/types";

export default async function HomePage() {
  const [products, user] = await Promise.all([getAllProducts(), getCurrentUser()]);
  return (
    <Storefront
      products={products as unknown as Product[]}
      currentUser={user ? { name: user.name, isAdmin: isAdmin(user) } : null}
    />
  );
}
