import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
const { sessionClaims } = await auth();
const email = sessionClaims?.email as string | undefined;

    // Hardcoded check: Alleen jij komt erin
    if (email !== 'adam.akkay@student.ehb.be') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  
  if (isAdminRoute(req)) {
    if (email !== 'adam.akkay@student.ehb.be') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};





// export default clerkMiddleware();

// export const config = {
//  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
   // '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//    '/((?!_next|admin|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
//    '/(api|trpc)(.*)',
//  ],
// };