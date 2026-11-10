import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET() {
  try {
    let setting = await prisma.studioSetting.findUnique({
      where: { id: "studio_config" },
    });

    if (!setting) {
      setting = await prisma.studioSetting.create({
        data: { id: "studio_config" },
      });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error fetching studio settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch studio settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const updated = await prisma.studioSetting.upsert({
      where: { id: "studio_config" },
      update: {
        studioName: body.studioName,
        tagline: body.tagline,
        heroHeading: body.heroHeading,
        phone: body.phone,
        email: body.email,
        address: body.address,
        parisAddress: body.parisAddress,
        instagramUrl: body.instagramUrl,
        awardsCount: Number(body.awardsCount) || 28,
        yearsExperience: Number(body.yearsExperience) || 14,
        eventsCount: Number(body.eventsCount) || 420,
        clientsRating: Number(body.clientsRating) || 4.98,
      },
      create: {
        id: "studio_config",
        studioName: body.studioName || "LUMIÈRE STUDIO",
        tagline: body.tagline || "Where every frame tells a beautiful story.",
        heroHeading: body.heroHeading || "CAPTURING TIMELESS MOMENTS.",
        phone: body.phone || "+1 (212) 847-9200",
        email: body.email || "concierge@lumiere-studio.com",
        address: body.address || "740 Madison Avenue, New York, NY 10065",
        parisAddress: body.parisAddress || "18 Rue du Faubourg Saint-Honoré, 75008 Paris",
        instagramUrl: body.instagramUrl || "https://instagram.com/lumiere.studio",
        awardsCount: Number(body.awardsCount) || 28,
        yearsExperience: Number(body.yearsExperience) || 14,
        eventsCount: Number(body.eventsCount) || 420,
        clientsRating: Number(body.clientsRating) || 4.98,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating studio settings:", error);
    return NextResponse.json(
      { error: "Failed to update studio settings" },
      { status: 500 }
    );
  }
}

