import { MiddlewareConfig, NextResponse } from "next/server";

const publicRoutes = [
  { path: "/login", whenAuthenticated: 'redirect' },
  { path: "/register", whenAuthenticated: 'redirect' },
  // { path: "/posts", whenAuthenticated: 'next' },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/login";
const REDIRECT_WHEN_AUTHENTICATED = "/dashboard";

// this is the middleware
export function proxy(request: Request) {
  console.log("MIDDLEWARE EXECUTED", request.url);

  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path);
  const authToken = request.cookies.get("auth-token")?.value;

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && publicRoute && publicRoute?.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    // Here is the place to check if token is valid or expired
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * https://nextjs.org/docs/13/app/building-your-application/routing/middleware
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}