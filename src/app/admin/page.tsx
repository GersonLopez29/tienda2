import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/session";
import { listUsers } from "@/lib/users";
import { getVisitStats } from "@/lib/visits";
import { UserModeration } from "@/components/admin/user-moderation";
import { VisitStats } from "@/components/admin/visit-stats";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user)) redirect("/");

  const [users, stats] = await Promise.all([listUsers(), getVisitStats()]);
  return (
    <>
      <UserModeration users={users} currentUserId={user.id} />
      <VisitStats stats={stats} />
    </>
  );
}
