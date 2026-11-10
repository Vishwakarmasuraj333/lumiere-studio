import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import {
  sanitizeText,
  isValidEmail,
  isValidPhone,
  isValidDate,
} from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Rate limiting: max 10 booking submissions per 10 minutes per IP
    const rateLimit = checkRateLimit(request, {
      intervalMs: 10 * 60 * 1000,
      maxRequests: 10,
      prefix: "booking-submit",
    });
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.limit, rateLimit.reset);
    }

    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      service,
      preferredDate,
      location,
      guestCount,
      message,
      honeypot, // Hidden bot trap field
    } = body;

    // Honeypot spam protection
    if (honeypot && String(honeypot).trim().length > 0) {
      return NextResponse.json(
        { error: "Spam activity detected." },
        { status: 400 }
      );
    }

    // Required fields check
    if (!fullName || !email || !phone || !service || !preferredDate || !location) {
      return NextResponse.json(
        { error: "Please complete all required fields marked with an asterisk." },
        { status: 400 }
      );
    }

    // Sanitization & format validations
    const cleanName = sanitizeText(fullName);
    const cleanEmail = String(email).toLowerCase().trim();
    const cleanPhone = sanitizeText(phone);
    const cleanService = sanitizeText(service);
    const cleanLocation = sanitizeText(location);
    const cleanGuestCount = sanitizeText(guestCount);
    const cleanMessage = sanitizeText(message);

    if (cleanName.length < 2 || cleanName.length > 100) {
      return NextResponse.json(
        { error: "Full name must be between 2 and 100 characters." },
        { status: 400 }
      );
    }

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!isValidPhone(cleanPhone)) {
      return NextResponse.json(
        { error: "Please provide a valid international telephone number." },
        { status: 400 }
      );
    }

    if (!isValidDate(preferredDate)) {
      return NextResponse.json(
        { error: "Please select a valid date." },
        { status: 400 }
      );
    }

    // Generate unique luxury reference code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `LUM-2026-${randomSuffix}`;

    const newBooking = await prisma.booking.create({
      data: {
        reference,
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        service: cleanService,
        preferredDate,
        location: cleanLocation,
        guestCount: cleanGuestCount || null,
        message: cleanMessage || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your appointment request has been received by our concierge.",
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Unable to submit booking request. Please try again." },
      { status: 500 }
    );
  }
}
