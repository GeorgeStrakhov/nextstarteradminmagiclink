import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isAdmin = req.auth?.user?.isAdmin;

  // Protect admin routes
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all paths except static files, images, favicon, and NextAuth API routes
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
