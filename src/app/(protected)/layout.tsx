import { AppSidebar } from "@/components/AppSidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-4 h-full">
          {/* <PageHeader /> */}

          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
