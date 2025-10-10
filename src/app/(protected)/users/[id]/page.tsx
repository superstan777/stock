import { getUser } from "@/lib/api/users";
import { UserPageContent } from "@/components/UsersPage/UserPageContent";
import { EntityNotFound } from "@/components/EntityNotFound";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const user = await getUser(id);

    if (user) {
      return <UserPageContent user={user} userId={id} />;
    }
  } catch (error) {
    return <EntityNotFound />;
  }
}
