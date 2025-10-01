import { getUser } from "@/lib/api/users";
import { UserForm } from "@/components/UsersPage/UserForm";

import { UserDevicesList } from "@/components/UsersPage/UserDevicesList";
import { UserTicketsList } from "@/components/UsersPage/UserTicketsList";

interface UserPageProps {
  params: { id: string };
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = params;

  if (!id) return <div>No user ID provided.</div>;

  const user = await getUser(id);

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="p-4">
      <UserForm user={user} />

      <UserDevicesList userId={id} deviceType="computer" />
      <UserDevicesList userId={id} deviceType="monitor" />
      <UserTicketsList userId={id} />
    </div>
  );
}
