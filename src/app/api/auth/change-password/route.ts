import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthenticatedAdmin,
  verifyPassword,
  hashPassword,
  signAdminToken,
  AUTH_COOKIE_NAME,
} from "@/lib/auth";
import { validatePasswordStrength } from "@/lib/validation";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    // 1. Rate limiting: max 5 password change attempts per 15 mins
    const rateLimit = checkRateLimit(request, {
      intervalMs: 15 * 60 * 1000,
      maxRequests: 5,
      prefix: "change-password",
    });
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.limit, rateLimit.reset);
    }

    // 2. Authentication check
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    // 3. Look up user in database
    const user = await prisma.user.findUnique({
      where: { id: admin.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    // 4. Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Incorrect current password." },
        { status: 400 }
      );
    }

    // 5. Enforce password complexity
    const strengthCheck = validatePasswordStrength(newPassword);
    if (!strengthCheck.valid) {
      return NextResponse.json(
        { error: strengthCheck.errors.join(" ") },
        { status: 400 }
      );
    }

    // 6. Hash new password & persist to database
    const newPasswordHash = await hashPassword(newPassword);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
      },
    });

    // 7. Issue refreshed session token
    const token = await signAdminToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      mustChangePassword: false,
    });

    const response = NextResponse.json({
      success: true,
      message: "Passphrase successfully updated.",
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating the passphrase." },
      { status: 500 }
    );
  }
}
