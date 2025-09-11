import { NextRequest, NextResponse } from "next/server";
import { DeviceType } from "@/lib/types/devices";
import {
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice,
} from "@/lib/api/devices";

export async function GET(
  req: NextRequest,
  context: { params: { deviceType: string } | Promise<{ deviceType: string }> }
) {
  const params = await Promise.resolve(context.params);
  const deviceType = params.deviceType as DeviceType;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "20");
  const filter = searchParams.get("filter") as
    | "serial_number"
    | "model"
    | "order_id"
    | "install_status"
    | null;
  const query = searchParams.get("query") || undefined;

  try {
    const result = await getDevices(
      deviceType,
      filter ?? undefined,
      query,
      page,
      perPage
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { deviceType: string } | Promise<{ deviceType: string }> }
) {
  const params = await Promise.resolve(context.params);
  const deviceType = params.deviceType as DeviceType;
  const body = await req.json();

  try {
    const result = await addDevice(deviceType, body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { deviceType: string } | Promise<{ deviceType: string }> }
) {
  const params = await Promise.resolve(context.params);
  const deviceType = params.deviceType as DeviceType;
  const { id, ...updates } = await req.json();
  if (!id)
    return NextResponse.json({ error: "ID is required" }, { status: 400 });

  try {
    const result = await updateDevice(deviceType, id, updates);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { deviceType: string } | Promise<{ deviceType: string }> }
) {
  const params = await Promise.resolve(context.params);
  const deviceType = params.deviceType as DeviceType;
  const { id } = await req.json();
  if (!id)
    return NextResponse.json({ error: "ID is required" }, { status: 400 });

  try {
    const result = await deleteDevice(deviceType, id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
