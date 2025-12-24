import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Beschermde routes
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isBusinessDashboard = createRouteMatcher(['/business/dashboard(.*)']);
// Voeg de callback route toe aan de uitzonderingen
const isPublicRoute = createRouteMatcher(['/', '/login(.*)', '/signup(.*)', '/auth-callback']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 1. Als de route publiek is (zoals /auth-callback), laat de middleware direct doorgaan
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. Als iemand niet is ingelogd en naar een beschermde route gaat
  if (!userId && (isAdminRoute(req) || isBusinessDashboard(req))) {
    return NextResponse.redirect(new URL('/login/business', req.url));
  }

  if (userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress;

    const isAdam = email === 'adam.akkay@student.ehb.be';

    // 3. Forceer om naar /admin te gaan
    if (isAdam && isBusinessDashboard(req)) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // 4. Blokkeer admin toegang voor iedereen die geen admin is
    if (isAdminRoute(req) && !isAdam) {
      return NextResponse.redirect(new URL('/business/dashboard', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};