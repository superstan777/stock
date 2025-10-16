import { DevicePage } from "@/components/DevicesPage/DevicePage";

export default async function ComputerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DevicePage id={id} />;
}
