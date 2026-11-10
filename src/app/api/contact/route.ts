import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { sanitizeText, isValidEmail } from "@/lib/validation";

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Rate limiting: max 10 messages per 10 minutes per IP
    const rateLimit = checkRateLimit(request, {
      intervalMs: 10 * 60 * 1000,
      maxRequests: 10,
      prefix: "contact-submit",
    });
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.limit, rateLimit.reset);
    }

    const body = await request.json();
    const { fullName, email, phone, subject, message, honeypot } = body;

    // Honeypot spam trap
    if (honeypot && String(honeypot).trim().length > 0) {
      return NextResponse.json({ error: "Spam activity detected." }, { status: 400 });
    }

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const cleanName = sanitizeText(fullName);
    const cleanEmail = String(email).toLowerCase().trim();
    const cleanPhone = phone ? sanitizeText(phone) : null;
    const cleanSubject = sanitizeText(subject);
    const cleanMessage = sanitizeText(message);

    if (cleanName.length < 2 || cleanName.length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters." },
        { status: 400 }
      );
    }

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (cleanSubject.length > 150) {
      return NextResponse.json(
        { error: "Subject must not exceed 150 characters." },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been delivered directly to our creative directors.",
        inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
