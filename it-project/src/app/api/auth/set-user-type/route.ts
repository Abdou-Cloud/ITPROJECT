import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST - Stel het userType in voor de ingelogde gebruiker in Clerk's publicMetadata
 * Body: { userType: "business" | "client" }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Niet geautoriseerd" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userType } = body;

    if (!userType || !["business", "client"].includes(userType)) {
      return NextResponse.json(
        { error: "userType moet 'business' of 'client' zijn" },
        { status: 400 }
      );
    }

    // Update de Clerk user met het userType in publicMetadata
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        userType,
      },
    });

    return NextResponse.json({
      success: true,
      userType,
    });
  } catch (error) {
    console.error("Fout bij instellen userType:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
