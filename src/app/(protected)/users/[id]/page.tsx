import { getUser } from "@/lib/api/users";
import { UserForm } from "@/components/UsersPage/UserForm";
import { UserTabs } from "@/components/UsersPage/UserTabs";

interface UserPageProps {
  params: { id: string };
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = params;

  if (!id) return <div>No user id provided.</div>;

  const user = await getUser(id);

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="p-4">
      <UserForm user={user} />

      <UserTabs userId={id} />
    </div>
  );
}
