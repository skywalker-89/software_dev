import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Use jose for JWT verification

const SECRET_KEY = process.env.JWT_SECRET || ""; // Use env for security

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    return payload; // Return decoded JWT payload
  } catch (err) {
    console.log("JWT Verification Failed:", err);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  // Read JWT from Authorization Header
  const token = req.cookies.get("token")?.value;
  // console.log(token);
  // console.log(SECRET_KEY);

  const protectedRoutes = [
    "/account",
    // "/chat",
    // "/facebook-auth-success",
    // "/google-auth-success",
    "/item",
    "/post-found-item",
    "/report-lost-item",
    "/",
  ];

  // Allow access to login and register pages
  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register") ||
    req.nextUrl.pathname.startsWith("/gmailConfirm") ||
    req.nextUrl.pathname.startsWith("/google-auth-success") ||
    req.nextUrl.pathname.startsWith("/facebook-auth-success") ||
    req.nextUrl.pathname.startsWith("/chat")
  ) {
    return NextResponse.next();
  }

  // Check if route is protected and requires authentication
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      console.log("No token found. Redirecting to login...");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const verifiedToken = await verifyToken(token);

    if (!verifiedToken) {
      console.log("Invalid token. Redirecting to login...");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("Token verified:", verifiedToken);
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Ensure middleware applies to all routes except static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
