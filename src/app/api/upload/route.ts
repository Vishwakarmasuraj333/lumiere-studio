import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { isValidHttpUrl } from "@/lib/validation";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB max

export async function POST(request: Request) {
  try {
    // 1. Rate limiting
    const rateLimit = checkRateLimit(request, {
      intervalMs: 10 * 60 * 1000,
      maxRequests: 20,
      prefix: "image-upload",
    });
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.limit, rateLimit.reset);
    }

    // 2. Authentication
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const directUrl = formData.get("directUrl") as string | null;

    // Direct URL option
    if (directUrl && directUrl.trim()) {
      const trimmedUrl = directUrl.trim();
      if (!isValidHttpUrl(trimmedUrl)) {
        return NextResponse.json(
          { error: "Invalid URL provided. Must begin with http:// or https://" },
          { status: 400 }
        );
      }
      return NextResponse.json({ url: trimmedUrl });
    }

    // File upload option
    if (!file) {
      return NextResponse.json(
        { error: "No image file or URL provided." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image file exceeds maximum allowable size of 10MB." },
        { status: 400 }
      );
    }

    // Validate MIME type
    const mimeType = file.type.toLowerCase();
    const extension = ALLOWED_MIME_TYPES[mimeType];
    if (!extension) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Please upload a valid JPEG, PNG, WebP, AVIF, or GIF image.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate collision-resistant secure filename
    const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: file.size,
      mimeType,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process image upload." },
      { status: 500 }
    );
  }
}
