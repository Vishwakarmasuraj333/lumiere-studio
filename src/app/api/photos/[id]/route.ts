import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.photo.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category,
        description: body.description,
        imageUrl: body.imageUrl,
        cameraModel: body.cameraModel,
        lensInfo: body.lensInfo,
        aperture: body.aperture,
        location: body.location,
        year: body.year,
        orientation: body.orientation,
        featured: Boolean(body.featured),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json(
      { error: "Failed to update photograph" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.photo.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Photograph deleted" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Failed to delete photograph" },
      { status: 500 }
    );
  }
}

