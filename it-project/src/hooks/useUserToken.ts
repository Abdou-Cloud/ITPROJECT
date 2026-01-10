"use client"; // verplicht voor client-side hooks in Next.js
import { useUser, useAuth } from "@clerk/nextjs";

export function useUserToken() {
    const { user, isSignedIn } = useUser();
    const { getToken } = useAuth();

    const getUserToken = async () => {
        if (!isSignedIn || !user) return null;

        // Haal JWT op voor ingelogde gebruiker
        const token = await getToken();
        return token;
    };

    return { user, isSignedIn, getUserToken };
}
