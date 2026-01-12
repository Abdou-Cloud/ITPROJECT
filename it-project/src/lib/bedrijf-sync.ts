import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Zorgt ervoor dat een Bedrijf record bestaat voor de gegeven Clerk userId.
 * Als de gebruiker al een Werknemer is, retourneert hun bestaande Bedrijf.
 * Zo niet, maakt alleen een nieuw Bedrijf aan.
 * 
 * Deze functie is idempotent - kan veilig meerdere keren worden aangeroepen.
 * 
 * @param userId - Clerk gebruikers-ID
 * @returns Het bestaande of nieuw aangemaakte Bedrijf record
 * @throws Error als gebruikersdata niet kan worden opgehaald van Clerk of database operatie faalt
 */
export async function ensureBedrijfExists(userId: string) {
  try {
    // Haal gebruiker op van Clerk (eenmalig aan het begin)
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (!user) {
      throw new Error(`Clerk gebruiker niet gevonden voor userId: ${userId}`);
    }

    const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    // Controleer of gebruiker al een Werknemer is (via email, want Werknemer heeft geen clerkUserId)
    const existingWerknemer = userEmail ? await prisma.werknemer.findFirst({
      where: { email: userEmail },
      include: { bedrijf: true },
    }) : null;

    if (existingWerknemer && existingWerknemer.bedrijf) {
      console.log(`[Bedrijf Sync] Bestaande Werknemer gevonden voor userId: ${userId}, bedrijf_id: ${existingWerknemer.bedrijf_id}`);
      return existingWerknemer.bedrijf;
    }

    // Gebruiker is niet gekoppeld aan een Bedrijf via Werknemer
    // Controleer eerst of er al een Bedrijf bestaat met hetzelfde email adres
    const primaryEmail = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress || "";

    if (!primaryEmail) {
      throw new Error(`Geen primair e-mailadres gevonden voor Clerk gebruiker: ${userId}`);
    }

    // Controleer of er al een Bedrijf bestaat met dit email adres
    const existingBedrijf = await prisma.bedrijf.findFirst({
      where: { email: primaryEmail },
    });

    if (existingBedrijf) {
      console.log(`[Bedrijf Sync] Bestaand Bedrijf gevonden met email ${primaryEmail}, bedrijf_id: ${existingBedrijf.bedrijf_id}`);
      return existingBedrijf;
    }

    // Geen Bedrijf gevonden, maak nieuw Bedrijf aan
    console.log(`[Bedrijf Sync] Geen Bedrijf gevonden voor userId: ${userId}, maak nieuw Bedrijf aan...`);

    // Haal voornaam en achternaam op van Clerk gebruiker met fallbacks
    const firstName = user.firstName || "Onbekend";
    const lastName = user.lastName || "Onbekend";

    // Maak nieuw Bedrijf aan met gebruikersinformatie
    // Gebruik gebruikersnaam als bedrijfsnaam, of e-maildomein indien beschikbaar
    const companyName = `${firstName} ${lastName}`.trim() || primaryEmail.split("@")[0] || "Nieuw Bedrijf";
    const companyEmail = primaryEmail;
    const companyPhone = "N/A";

    // Maak alleen Bedrijf aan (geen Admin)
    console.log(`[Bedrijf Sync] Maak Bedrijf aan: naam="${companyName}", email="${companyEmail}"`);
    
    const newBedrijf = await prisma.bedrijf.create({
      data: {
        naam: companyName,
        email: companyEmail,
        telefoonnummer: companyPhone,
      },
    });

    console.log(`[Bedrijf Sync] ✓ Nieuw Bedrijf aangemaakt voor userId: ${userId}, bedrijf_id: ${newBedrijf.bedrijf_id}, email: ${primaryEmail}`);

    return newBedrijf;
  } catch (error) {
    console.error(`[Bedrijf Sync] ✗ Fout bij zorgen dat Bedrijf bestaat voor userId: ${userId}`);
    console.error(`[Bedrijf Sync] Error type:`, error instanceof Error ? error.constructor.name : typeof error);
    console.error(`[Bedrijf Sync] Error message:`, error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error(`[Bedrijf Sync] Error stack:`, error.stack);
    }
    // Log Prisma errors specifiek
    if (error && typeof error === 'object' && 'code' in error) {
      console.error(`[Bedrijf Sync] Prisma error code:`, (error as any).code);
      console.error(`[Bedrijf Sync] Prisma error meta:`, (error as any).meta);
    }
    throw error;
  }
}

/**
 * Haal bedrijf_id op voor een gegeven Clerk userId.
 * Probeert in deze volgorde: Werknemer (via email), Bedrijf (via email).
 * Maakt GEEN nieuwe bedrijven aan - retourneert null als niets gevonden wordt.
 * 
 * @param userId - Clerk gebruikers-ID
 * @returns bedrijf_id of null als geen bedrijf gevonden
 */
export async function getBedrijfIdForUser(userId: string): Promise<number | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    if (!user) {
      return null;
    }

    const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!userEmail) {
      return null;
    }

    // 1. Probeer Werknemer (via email)
    const werknemer = await prisma.werknemer.findFirst({
      where: { email: userEmail },
      select: { bedrijf_id: true },
    });

    if (werknemer?.bedrijf_id) {
      return werknemer.bedrijf_id;
    }

    // 2. Probeer Bedrijf direct (via email)
    const bedrijf = await prisma.bedrijf.findFirst({
      where: { email: userEmail },
      select: { bedrijf_id: true },
    });

    if (bedrijf?.bedrijf_id) {
      return bedrijf.bedrijf_id;
    }

    return null;
  } catch (error) {
    console.error("Fout bij ophalen bedrijf_id:", error);
    return null;
  }
}
