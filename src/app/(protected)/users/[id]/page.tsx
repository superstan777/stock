// src/app/(protected)/users/[id]/page.tsx
import { getUser } from "@/lib/api/users";
import { UserForm } from "@/components/UsersPage/UserForm";
import { UserDevicesList } from "@/components/UsersPage/UserDevicesList";
import { UserTicketsList } from "@/components/UsersPage/UserTicketsList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

  const triggerClass =
    "px-4 py-2 rounded-t-md border-b-2 border-transparent " +
    "data-[state=active]:border-b-gray-200 data-[state=active]:-mb-px " +
    "data-[state=active]:text-gray-900";

  return (
    <div className="p-4">
      <UserForm user={user} />

      <div className="mt-6 w-full">
        <Tabs defaultValue="computers" className="w-full">
          <div className="flex justify-center ">
            <TabsList className="inline-flex mb-0 space-x-4">
              <TabsTrigger value="computers" className={triggerClass}>
                Computers
              </TabsTrigger>
              <TabsTrigger value="monitors" className={triggerClass}>
                Monitors
              </TabsTrigger>
              <TabsTrigger value="tickets" className={triggerClass}>
                Tickets
              </TabsTrigger>
            </TabsList>
          </div>

          <div>
            <TabsContent value="computers">
              <UserDevicesList userId={id} deviceType="computer" />
            </TabsContent>

            <TabsContent value="monitors">
              <UserDevicesList userId={id} deviceType="monitor" />
            </TabsContent>

            <TabsContent value="tickets">
              <UserTicketsList userId={id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
