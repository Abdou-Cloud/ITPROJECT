import { NextResponse } from "next/server";

export async function GET() {
  // Voorbeelddata voor weekstats
  const data = {
    week: "2026-W02",
    stats: [
      { day: "maandag", value: 10 },
      { day: "dinsdag", value: 15 },
      { day: "woensdag", value: 8 },
      { day: "donderdag", value: 12 },
      { day: "vrijdag", value: 20 },
      { day: "zaterdag", value: 5 },
      { day: "zondag", value: 3 }
    ]
  };
  return NextResponse.json(data);
}
