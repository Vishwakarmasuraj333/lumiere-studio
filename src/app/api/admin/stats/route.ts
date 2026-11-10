import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalPhotos,
      photosByCategoryRaw,
      totalInquiries,
      unreadInquiries,
      recentBookings,
      recentInquiries,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.photo.count(),
      prisma.photo.groupBy({
        by: ["category"],
        _count: { id: true },
      }),
      prisma.contactInquiry.count(),
      prisma.contactInquiry.count({ where: { isRead: false } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactInquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const photosByCategory: Record<string, number> = {};
    for (const group of photosByCategoryRaw) {
      photosByCategory[group.category] = group._count.id;
    }

    return NextResponse.json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalPhotos,
      photosByCategory,
      totalInquiries,
      unreadInquiries,
      recentBookings,
      recentInquiries,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}

