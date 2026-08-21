import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const { pathname } = request.nextUrl;

  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const protectedRoutes = [
    "/",
    "/dashboard",
    "/appointments",
    "/appointments/new",
    "/vehicles",
    "/employees",
    "/profile",
  ];

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (protectedRoutes.includes(pathname) && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/vehicles/:path*",
    "/appointments/:path*",
    "/employees/:path*",
    "/profile/:path*",
  ],
};
