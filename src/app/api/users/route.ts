import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/lib/api/users";

export async function GET(req: NextRequest) {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
