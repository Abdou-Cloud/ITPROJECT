import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ensureKlantExists } from "@/lib/klant-sync";

/**
 * GET /api/auth/sync-klant
 * Ensures a Klant record exists for the authenticated user.
 * Creates one if it doesn't exist, using data from Clerk.
 * 
 * This endpoint is idempotent and can be called multiple times safely.
 * 
 * Returns: The existing or newly created Klant record
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Niet geautoriseerd" },
        { status: 401 }
      );
    }

    // Retrieve full user data from Clerk for logging
    const user = await currentUser();
    console.log(`[Sync Klant API] Syncing Klant for userId: ${userId}, email: ${user?.emailAddresses[0]?.emailAddress || "N/A"}`);

    const klant = await ensureKlantExists(userId);

    return NextResponse.json({
      success: true,
      klant: {
        klant_id: klant.klant_id,
        voornaam: klant.voornaam,
        naam: klant.naam,
        email: klant.email,
        bedrijf_id: klant.bedrijf_id,
      },
    });
  } catch (error) {
    console.error("[Sync Klant API] Fout bij synchroniseren klant:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het synchroniseren van de klant",
        details: error instanceof Error ? error.message : "Onbekende fout",
      },
      { status: 500 }
    );
  }
}



