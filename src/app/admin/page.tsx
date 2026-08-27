import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/session";
import { listUsers } from "@/lib/users";
import { getVisitsByCountry } from "@/lib/visits";
import { UserModeration } from "@/components/admin/user-moderation";
import { VisitsByCountry } from "@/components/admin/visits-by-country";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user)) redirect("/");

  const [users, visits] = await Promise.all([listUsers(), getVisitsByCountry()]);
  return (
    <>
      <UserModeration users={users} currentUserId={user.id} />
      <VisitsByCountry visits={visits} />
    </>
  );
}
