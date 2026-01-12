import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is a Klant
        const klant = await prisma.klant.findUnique({
            where: { clerkUserId: userId },
            select: {
                klant_id: true,
                voornaam: true,
                naam: true,
                email: true,
                telefoonnummer: true,
                geboorte_datum: true
            },
        });

        if (klant) {
            return NextResponse.json({ ...klant, role: "klant" }, { status: 200 });
        }

        return NextResponse.json(
            { error: "Gebruiker niet gevonden in database" },
            { status: 404 }
        );
    } catch (error) {
        console.error("Fout in /api/me:", error);
        return NextResponse.json(
            { error: "Interne serverfout" },
            { status: 500 }
        );
    }
}
