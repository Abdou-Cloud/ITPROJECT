import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ensureBedrijfExists } from "@/lib/bedrijf-sync";

/**
 * GET /api/auth/sync-bedrijf
 * Zorgt ervoor dat een Bedrijf record bestaat voor de geauthenticeerde gebruiker.
 * Maakt er een aan als deze niet bestaat, met gebruik van data van Clerk.
 * 
 * Dit endpoint is idempotent en kan veilig meerdere keren worden aangeroepen.
 * 
 * Retourneert: Het bestaande of nieuw aangemaakte Bedrijf record
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

    // Haal volledige gebruikersdata op van Clerk voor logging
    const user = await currentUser();
    console.log(`[Sync Bedrijf API] Synchroniseer Bedrijf voor userId: ${userId}, email: ${user?.emailAddresses[0]?.emailAddress || "N/A"}`);

    const bedrijf = await ensureBedrijfExists(userId);

    return NextResponse.json({
      success: true,
      bedrijf: {
        bedrijf_id: bedrijf.bedrijf_id,
        naam: bedrijf.naam,
        email: bedrijf.email,
        telefoonnummer: bedrijf.telefoonnummer,
      },
    });
  } catch (error) {
    console.error("[Sync Bedrijf API] Fout bij synchroniseren bedrijf:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het synchroniseren van het bedrijf",
        details: error instanceof Error ? error.message : "Onbekende fout",
      },
      { status: 500 }
    );
  }
}

