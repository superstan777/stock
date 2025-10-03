import { getUser } from "@/lib/api/users";
import { UserPageContent } from "@/components/UsersPage/UserPageContent";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return <div>No user id provided.</div>;

  const user = await getUser(id);

  if (!user) return <div>User not found.</div>;

  return <UserPageContent user={user} userId={id} />;
}
