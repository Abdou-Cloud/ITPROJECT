import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isPublicRoute = createRouteMatcher(['/', '/login(.*)', '/signup(.*)', '/auth-callback(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = req.nextUrl.pathname;

  // 1. Publieke routes altijd toestaan
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. Niet ingelogd? Redirect naar login
  if (!userId) {
    if (isAdminRoute(req) || url.startsWith('/business') || url.startsWith('/assistant')) {
      return NextResponse.redirect(new URL('/login/business', req.url));
    }
    return NextResponse.next();
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;

    // --- STRIKTE ADMIN CHECK ---
    const userEmail = email?.toLowerCase().trim();
    const isAdam = userEmail === 'adam.akkay@hotmail.com';
    // voor controle : console.log("Ingelogde mail:", userEmail);

    if (isAdam) {
      // Als Adam is ingelogd, mag hij ONLY op /admin (of API) zijn
      if (!url.startsWith('/admin') && !url.startsWith('/api')) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.next();
    }

    // --- BEVEILIGING VOOR ANDERE GEBRUIKERS ---
    // Als iemand die GEEN Adam is op /admin probeert te komen
    if (isAdminRoute(req) && !isAdam) {
      return NextResponse.redirect(new URL('/', req.url));
    }

  } catch (error) {
    // Voorkomt de witte error pagina bij Clerk API problemen
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
