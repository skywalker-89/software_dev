// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose"; // Use jose for JWT verification

// const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Use env for security

// async function verifyToken(token: string) {
//   try {
//     const secret = new TextEncoder().encode(SECRET_KEY);
//     const { payload } = await jwtVerify(token, secret);
//     return payload; // Return decoded JWT payload
//   } catch (err) {
//     console.log("JWT Verification Failed:", err);
//     return null;
//   }
// }

// export async function middleware(req: NextRequest) {
//   // Read JWT from Authorization Header
//   const authHeader = req.headers.get("authorization");
//   const token = authHeader?.split(" ")[1]; // Expect "Bearer <token>"

//   const protectedRoutes = [
//     "/account",
//     "/chat",
//     "/facebook-auth-success",
//     "/gmailConfirm",
//     "/google-auth-success",
//     "/item",
//     "/post-found-item",
//     "/report-lost-item",
//   ];

//   // Allow access to login and register pages
//   if (
//     req.nextUrl.pathname.startsWith("/login") ||
//     req.nextUrl.pathname.startsWith("/register")
//   ) {
//     return NextResponse.next();
//   }

//   // Check if route is protected and requires authentication
//   if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
//     if (!token) {
//       console.log("No token found. Redirecting to login...");
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     const verifiedToken = await verifyToken(token);

//     if (!verifiedToken) {
//       console.log("Invalid token. Redirecting to login...");
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     console.log("Token verified:", verifiedToken);
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// // Ensure middleware applies to all routes except static files
// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware is running for:", req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Apply to all routes
};
