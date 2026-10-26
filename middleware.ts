import { NextResponse, type NextRequest } from "next/server";

// Cheap first gate: no session cookie, no admin page. Every page and action still
// checks the session against the database with requireUser().
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/admin/login" && !request.cookies.has("kfx_session")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = { matcher: ["/admin/:path*"] };
