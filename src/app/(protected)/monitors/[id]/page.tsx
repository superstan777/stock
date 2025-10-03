import { getDevice } from "@/lib/api/devices";
import { DevicePageContent } from "@/components/DevicesPage/DevicePageContent";

export default async function MonitorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return <div>No device id provided.</div>;

  const deviceType = "monitor";
  const device = await getDevice(deviceType, id);

  if (!device) return <div>Device not found.</div>;

  return <DevicePageContent device={device} deviceType={deviceType} />;
}
