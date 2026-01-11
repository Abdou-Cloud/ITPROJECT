import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Hier kun je echte checks toevoegen, nu dummy data
  return NextResponse.json({
    database: "operational",
    email: "operational",
    voiceApi: "operational",
    calendarSync: "operational"
  });
}
