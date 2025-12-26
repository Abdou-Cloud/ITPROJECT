import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST - Reset het userType voor de huidige ingelogde gebruiker
 * Dit verwijdert de userType uit publicMetadata zodat de gebruiker opnieuw kan kiezen
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

    // Update de Clerk user en verwijder het userType
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        userType: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "UserType is gereset. Je kunt nu opnieuw inloggen.",
    });
  } catch (error) {
    console.error("Fout bij resetten userType:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
