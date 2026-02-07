import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your secret key
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
export async function middleware(req) {
  console.log(req,"req in mid");
  
  const token = req.cookies.get("authToken")?.value; // Get the token from cookies

  // If no token is found, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify the token
    const decoded = await verifyToken(token);

    // If the token is valid, continue to the requested page
    if (decoded) {
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Token verification failed:", error);
  }

  // If the token is invalid, redirect to the login page
  return NextResponse.redirect(new URL("/login", req.url));
}

// Specify the routes to apply this middleware
export const config = {
  matcher: ["/dashboard/:path*", "/booking/:path*"], // Protect all routes under /dashboard and /booking
};