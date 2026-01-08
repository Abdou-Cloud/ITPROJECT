import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Zorgt ervoor dat een Bedrijf record bestaat voor de gegeven Clerk userId.
 * Als de gebruiker al een Werknemer of Admin is, retourneert hun bestaande Bedrijf.
 * Zo niet, maakt een nieuw Bedrijf en een Admin record aan voor de gebruiker.
 * 
 * Deze functie is idempotent - kan veilig meerdere keren worden aangeroepen.
 * 
 * @param userId - Clerk gebruikers-ID
 * @returns Het bestaande of nieuw aangemaakte Bedrijf record
 * @throws Error als gebruikersdata niet kan worden opgehaald van Clerk of database operatie faalt
 */
export async function ensureBedrijfExists(userId: string) {
  try {
    // Controleer of gebruiker al een Werknemer is (via email, want Werknemer heeft geen clerkUserId)
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    const existingWerknemer = userEmail ? await prisma.werknemer.findFirst({
      where: { email: userEmail },
      include: { bedrijf: true },
    }) : null;

    if (existingWerknemer && existingWerknemer.bedrijf) {
      console.log(`[Bedrijf Sync] Bestaande Werknemer gevonden voor userId: ${userId}, bedrijf_id: ${existingWerknemer.bedrijf_id}`);
      return existingWerknemer.bedrijf;
    }

    // Controleer of gebruiker al een Admin is
    const existingAdmin = await prisma.admin.findUnique({
      where: { clerkUserId: userId },
      include: { bedrijf: true },
    });

    if (existingAdmin && existingAdmin.bedrijf) {
      console.log(`[Bedrijf Sync] Bestaande Admin gevonden voor userId: ${userId}, bedrijf_id: ${existingAdmin.bedrijf_id}`);
      return existingAdmin.bedrijf;
    }

    // Gebruiker is niet gekoppeld aan een Bedrijf, maak nieuw Bedrijf en Admin record aan
    console.log(`[Bedrijf Sync] Geen Bedrijf gevonden voor userId: ${userId}, maak nieuw Bedrijf en Admin record aan...`);
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (!user) {
      throw new Error(`Clerk gebruiker niet gevonden voor userId: ${userId}`);
    }

    // Haal primair e-mailadres op
    const primaryEmail = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress || "";

    if (!primaryEmail) {
      throw new Error(`Geen primair e-mailadres gevonden voor Clerk gebruiker: ${userId}`);
    }

    // Haal voornaam en achternaam op van Clerk gebruiker met fallbacks
    const firstName = user.firstName || "Onbekend";
    const lastName = user.lastName || "Onbekend";

    // Maak nieuw Bedrijf aan met gebruikersinformatie
    // Gebruik gebruikersnaam als bedrijfsnaam, of e-maildomein indien beschikbaar
    const companyName = `${firstName} ${lastName}`.trim() || primaryEmail.split("@")[0] || "Nieuw Bedrijf";
    const companyEmail = primaryEmail;
    const companyPhone = "N/A";

    // Maak Bedrijf en Admin aan in een transactie
    const result = await prisma.$transaction(async (tx) => {
      // Maak nieuw Bedrijf aan
      const newBedrijf = await tx.bedrijf.create({
        data: {
          naam: companyName,
          email: companyEmail,
          telefoonnummer: companyPhone,
        },
      });

      // Maak Admin record aan voor de gebruiker
      const newAdmin = await tx.admin.create({
        data: {
          clerkUserId: userId,
          voornaam: firstName,
          naam: lastName,
          email: primaryEmail,
          bedrijf_id: newBedrijf.bedrijf_id,
        },
      });

      return { bedrijf: newBedrijf, admin: newAdmin };
    });

    console.log(`[Bedrijf Sync] ✓ Nieuw Bedrijf en Admin record aangemaakt voor userId: ${userId}, bedrijf_id: ${result.bedrijf.bedrijf_id}, email: ${primaryEmail}`);

    return result.bedrijf;
  } catch (error) {
    console.error(`[Bedrijf Sync] ✗ Fout bij zorgen dat Bedrijf bestaat voor userId: ${userId}`, error);
    throw error;
  }
}

