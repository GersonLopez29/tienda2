import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/session";
import { listUsers } from "@/lib/users";
import { getAllProducts } from "@/lib/products";
import { getVisitsByCountry } from "@/lib/visits";
import { UserModeration } from "@/components/admin/user-moderation";
import { ProductDiscounts } from "@/components/admin/product-discounts";
import { VisitsByCountry } from "@/components/admin/visits-by-country";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user)) redirect("/");

  const [users, products, visits] = await Promise.all([listUsers(), getAllProducts(), getVisitsByCountry()]);
  return (
    <>
      <UserModeration users={users} currentUserId={user.id} />
      <ProductDiscounts products={products} />
      <VisitsByCountry visits={visits} />
    </>
  );
}
