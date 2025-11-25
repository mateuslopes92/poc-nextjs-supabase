import { MiddlewareConfig, NextResponse } from "next/server";

const publicRoutes = [
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/auth", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/login";
const REDIRECT_WHEN_AUTHENTICATED = "/dashboard";

export function proxy(request: Request) {
  console.log("MIDDLEWARE EXECUTED", request.url);

  const path = request.nextUrl.pathname;
  console.log("Requested path:", path);
  const publicRoute = publicRoutes.find(route =>
    path.startsWith(route.path)
  );
  console.log("Public route:", publicRoute);


  const authToken = request.cookies.get("auth-token")?.value;

  // Unauthenticated user accessing public route
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  // Unauthenticated + private route → redirect
  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    return NextResponse.redirect(redirectUrl);
  }

  // Authenticated trying to access login/register → redirect
  if (
    authToken &&
    publicRoute &&
    publicRoute?.whenAuthenticated === "redirect"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_AUTHENTICATED;
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    // Here is the place to check if token is valid or expired
    return NextResponse.next();
  }

  // Authenticated accessing private route → allow
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
