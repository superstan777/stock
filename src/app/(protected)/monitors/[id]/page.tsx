import { getDevice } from "@/lib/api/devices";
import { DevicePageContent } from "@/components/DevicesPage/DevicePageContent";
import { EntityNotFound } from "@/components/EntityNotFound";

export default async function ComputerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deviceType = "monitor";

  try {
    const device = await getDevice(deviceType, id);

    if (device) {
      return <DevicePageContent device={device} deviceType={deviceType} />;
    }
  } catch (error) {
    return <EntityNotFound />;
  }
}
