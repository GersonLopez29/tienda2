import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/session";
import { listUsers } from "@/lib/users";
import { UserModeration } from "@/components/admin/user-moderation";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user)) redirect("/");

  const users = await listUsers();
  return <UserModeration users={users} currentUserId={user.id} />;
}
