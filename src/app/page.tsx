import { getAllProducts } from "@/lib/products";
import { getCurrentUser, isAdmin } from "@/lib/session";
import { recordVisitAndGetCount } from "@/lib/visits";
import { Storefront } from "@/components/storefront/storefront";
import type { Product } from "@/lib/types";

export default async function HomePage() {
  const [products, user, visitCount] = await Promise.all([
    getAllProducts(),
    getCurrentUser(),
    recordVisitAndGetCount(),
  ]);
  return (
    <Storefront
      products={products as unknown as Product[]}
      currentUser={
        user ? { name: user.name, isAdmin: isAdmin(user), emailVerified: user.emailVerified } : null
      }
      visitCount={visitCount}
    />
  );
}
