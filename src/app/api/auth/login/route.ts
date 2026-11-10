import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signAdminToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { isValidEmail } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    // 1. Rate limiting: max 5 login attempts per 15 minutes per IP
    const rateLimit = checkRateLimit(request, {
      intervalMs: 15 * 60 * 1000,
      maxRequests: 5,
      prefix: "auth-login",
    });

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.limit, rateLimit.reset);
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanedEmail = email.toLowerCase().trim();
    if (!isValidEmail(cleanedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email format." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Check if user is using known default demo credentials
    const isUsingDefaultPassword = password === "admin123" || user.mustChangePassword;

    const token = await signAdminToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mustChangePassword: isUsingDefaultPassword,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mustChangePassword: isUsingDefaultPassword,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
