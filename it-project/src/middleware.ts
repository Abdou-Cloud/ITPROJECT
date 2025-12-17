import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Als iemand niet is ingelogd en naar admin probeert te gaan
  if (!userId && isAdminRoute(req)) {
    return NextResponse.redirect(new URL('/login/business', req.url));
  }

  if (userId) {
    // Haal de gebruiker direct op via de API (overslaat dashboard claims)
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress;

    const isAdam = email === 'adam.akkay@student.ehb.be';

    // 1. Forceer Adam naar /admin als hij op het gewone dashboard landt
    if (isAdam && req.nextUrl.pathname.startsWith('/business/dashboard')) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // 2. Blokkeer admin toegang voor iedereen die Adam niet is
    if (isAdminRoute(req) && !isAdam) {
      return NextResponse.redirect(new URL('/', req.url));
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