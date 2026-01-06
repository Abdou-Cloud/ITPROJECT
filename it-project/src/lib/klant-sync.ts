import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Default birth date for new customers (safe default)
 */
const DEFAULT_GEBOORTE_DATUM = new Date("2000-01-01");

/**
 * Gets the first available Bedrijf ID from the database.
 * Falls back to 1 if no bedrijven exist.
 * 
 * @returns The first available bedrijf_id
 */
async function getFirstAvailableBedrijfId(): Promise<number> {
  const firstBedrijf = await prisma.bedrijf.findFirst({
    orderBy: {
      bedrijf_id: "asc",
    },
    select: {
      bedrijf_id: true,
    },
  });

  if (firstBedrijf) {
    return firstBedrijf.bedrijf_id;
  }

  // Fallback to 1 if no bedrijven exist (should not happen in production)
  console.warn("[Klant Sync] No bedrijven found in database, using fallback bedrijf_id: 1");
  return 1;
}

/**
 * Ensures a Klant record exists for the given Clerk userId.
 * If no Klant exists, creates one using data from Clerk.
 * 
 * This function is idempotent - it can be called multiple times safely.
 * 
 * @param userId - Clerk user ID
 * @returns The existing or newly created Klant record
 * @throws Error if user data cannot be fetched from Clerk or database operation fails
 */
export async function ensureKlantExists(userId: string) {
  try {
    // Check if Klant already exists
    const existingKlant = await prisma.klant.findUnique({
      where: { clerkUserId: userId },
    });

    if (existingKlant) {
      // Klant already exists, log and return it
      console.log(`[Klant Sync] Existing Klant found for userId: ${userId}, klant_id: ${existingKlant.klant_id}`);
      return existingKlant;
    }

    // Klant doesn't exist, fetch user data from Clerk
    console.log(`[Klant Sync] Klant not found for userId: ${userId}, creating new record...`);
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (!user) {
      throw new Error(`Clerk user not found for userId: ${userId}`);
    }

    // Get primary email
    const primaryEmail = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress || "";

    if (!primaryEmail) {
      throw new Error(`No primary email found for Clerk user: ${userId}`);
    }

    // Extract first name and last name from Clerk user with fallbacks
    const firstName = user.firstName || "Onbekend";
    const lastName = user.lastName || "Onbekend";

    // Get first available bedrijf_id
    const bedrijfId = await getFirstAvailableBedrijfId();

    // Create new Klant record
    const newKlant = await prisma.klant.create({
      data: {
        clerkUserId: userId,
        voornaam: firstName,
        naam: lastName,
        email: primaryEmail,
        telefoonnummer: "N/A",
        geboorte_datum: DEFAULT_GEBOORTE_DATUM,
        bedrijf_id: bedrijfId,
      },
    });

    console.log(`[Klant Sync] ✓ Created new Klant record for userId: ${userId}, klant_id: ${newKlant.klant_id}, email: ${primaryEmail}, bedrijf_id: ${bedrijfId}`);

    return newKlant;
  } catch (error) {
    console.error(`[Klant Sync] ✗ Error ensuring Klant exists for userId: ${userId}`, error);
    throw error;
  }
}

