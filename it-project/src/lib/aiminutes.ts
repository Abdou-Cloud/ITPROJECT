import { prisma } from "@/lib/db";

/**
 * Verbruikt AI-belminuten voor een bedrijf
 * Gooit een error als de limiet bereikt is
 */
export async function useAIMinutes(
    bedrijfId: number,
    minutes: number
) {
    const bedrijf = await prisma.bedrijf.findUnique({
        where: { bedrijf_id: bedrijfId },
    });

    if (!bedrijf) {
        throw new Error("Bedrijf niet gevonden");
    }

    const now = new Date();

    // 👉 Reset bij nieuwe maand (jaar + maand check)
    const needsReset =
        !bedrijf.ai_last_reset ||
        bedrijf.ai_last_reset.getMonth() !== now.getMonth() ||
        bedrijf.ai_last_reset.getFullYear() !== now.getFullYear();

    if (needsReset) {
        await prisma.bedrijf.update({
            where: { bedrijf_id: bedrijfId },
            data: {
                ai_minutes_used: 0,
                ai_last_reset: now,
            },
        });

        bedrijf.ai_minutes_used = 0;
    }

    // 👉 Limiet check
    if (bedrijf.ai_minutes_used + minutes > bedrijf.ai_monthly_limit) {
        throw new Error(
            "Je hebt je belminutenlimiet voor deze maand bereikt. Upgrade naar PRO voor meer minuten."
        );
    }

    // 👉 Update verbruik
    const updated = await prisma.bedrijf.update({
        where: { bedrijf_id: bedrijfId },
        data: {
            ai_minutes_used: {
                increment: minutes,
            },
        },
    });

    return {
        used: updated.ai_minutes_used,
        limit: updated.ai_monthly_limit,
        remaining: updated.ai_monthly_limit - updated.ai_minutes_used,
        plan: updated.ai_plan,
    };
}
