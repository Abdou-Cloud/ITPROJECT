export async function getCurrentUser() {
    try {
        const res = await fetch("/api/me", {
            method: "GET",
            credentials: "include", // belangrijk zodat cookies/token meegestuurd worden
        });

        if (!res.ok) {
            return null; // niet ingelogd
        }

        const data = await res.json();
        return data; // bevat klant_id, voornaam, email, role, etc.
    } catch (e) {
        console.error("Error fetching current user:", e);
        return null;
    }
}
