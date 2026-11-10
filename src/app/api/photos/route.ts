import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const where: Record<string, unknown> = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (featured === "true") {
      where.featured = true;
    }

    const photos = await prisma.photo.findMany({
      where,
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photographs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      category,
      description,
      imageUrl,
      cameraModel,
      lensInfo,
      aperture,
      location,
      year,
      orientation,
      featured,
    } = body;

    if (!title || !category || !imageUrl) {
      return NextResponse.json(
        { error: "Title, category, and image URL are required" },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.create({
      data: {
        title,
        category,
        description: description || null,
        imageUrl,
        cameraModel: cameraModel || "Hasselblad H6D-100c",
        lensInfo: lensInfo || "HC 2,2/100mm",
        aperture: aperture || "f/2.2",
        location: location || "Studio Session",
        year: year || new Date().getFullYear().toString(),
        orientation: orientation || "portrait",
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Error creating photo:", error);
    return NextResponse.json(
      { error: "Failed to create photograph record" },
      { status: 500 }
    );
  }
}

