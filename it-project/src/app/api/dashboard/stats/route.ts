import { NextResponse } from "next/server";

export async function GET() {
  // Voorbeelddata voor stats
  const data = {
    totalUsers: 120,
    totalAppointments: 340,
    revenue: 15000,
    activeClients: 45
  };
  return NextResponse.json(data);
}
