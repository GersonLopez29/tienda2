import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/session";
import { listUsers } from "@/lib/users";
import { getAllProducts } from "@/lib/products";
import { UserModeration } from "@/components/admin/user-moderation";
import { ProductDiscounts } from "@/components/admin/product-discounts";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user)) redirect("/");

  const [users, products] = await Promise.all([listUsers(), getAllProducts()]);
  return (
    <>
      <UserModeration users={users} currentUserId={user.id} />
      <ProductDiscounts products={products} />
    </>
  );
}
