import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/types/supabase";
import { DeviceType } from "@/lib/types/devices";

const supabase = createClient();

type ComputerInsert = Database["public"]["Tables"]["computers"]["Insert"];
type ComputerUpdate = Database["public"]["Tables"]["computers"]["Update"];
type MonitorInsert = Database["public"]["Tables"]["monitors"]["Insert"];
type MonitorUpdate = Database["public"]["Tables"]["monitors"]["Update"];

type DeviceInsert = ComputerInsert | MonitorInsert;
type DeviceUpdate = ComputerUpdate | MonitorUpdate;
type InstallStatus = Database["public"]["Enums"]["install_status"];

const getTableName = (deviceType: DeviceType): "computers" | "monitors" =>
  deviceType === "computer" ? "computers" : "monitors";

// GET /api/devices/[deviceType]?page=1&filter=serial_number&query=abc
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ deviceType: string }> } // <- uwaga: Promise
) {
  const { deviceType: deviceTypeStr } = await context.params;
  const deviceType = deviceTypeStr as DeviceType;

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || "1");
  const filter = url.searchParams.get("filter") as
    | "serial_number"
    | "model"
    | "order_id"
    | "install_status"
    | undefined;
  const query = url.searchParams.get("query") || undefined;

  const tableName = getTableName(deviceType);

  let q = supabase
    .from(tableName)
    .select("*", { count: "exact" })
    .order("serial_number", { ascending: true });

  if (filter && query) {
    if (filter === "install_status") {
      q = q.eq(filter, query as InstallStatus);
    } else {
      q = q.ilike(filter, `${query}%`);
    }
  }

  const from = (page - 1) * 20;
  const to = from + 19;
  q = q.range(from, to);

  const { data, count, error } = await q;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], count: count ?? 0 });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ deviceType: string }> } // <- uwaga: Promise
) {
  try {
    const { deviceType: deviceTypeStr } = await context.params;
    const deviceType = deviceTypeStr as DeviceType;

    const device: DeviceInsert = await req.json();
    const tableName = getTableName(deviceType);

    const { data, error } = await supabase.from(tableName).insert([device]);
    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ deviceType: string }> } // <- uwaga: Promise
) {
  try {
    const { deviceType: deviceTypeStr } = await context.params;
    const deviceType = deviceTypeStr as DeviceType;

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const updates: DeviceUpdate = await req.json();
    const tableName = getTableName(deviceType);

    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
