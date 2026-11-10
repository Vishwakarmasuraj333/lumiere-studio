import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";
import { PhotoItem } from "@/components/home/PortfolioSection";
import { ServiceItem } from "@/components/home/ServicesSection";
import { TestimonialItem } from "@/components/home/TestimonialsSection";

export const revalidate = 0;

export default async function HomePage() {
  let initialPhotos: PhotoItem[] = [];
  let initialServices: ServiceItem[] = [];
  let initialTestimonials: TestimonialItem[] = [];

  try {
    [initialPhotos, initialServices, initialTestimonials] = await Promise.all([
      prisma.photo.findMany({
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.service.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
      prisma.testimonial.findMany({
        orderBy: [{ featured: "desc" }, { order: "asc" }],
      }),
    ]);
  } catch (error) {
    console.error("Error loading server data:", error);
  }

  // Serialize dates for client components
  const sanitizedPhotos = JSON.parse(JSON.stringify(initialPhotos));
  const sanitizedServices = JSON.parse(JSON.stringify(initialServices));
  const sanitizedTestimonials = JSON.parse(JSON.stringify(initialTestimonials));

  // JSON-LD Structured Data for Photography Business
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "PhotographyBusiness",
    name: "LUMIÈRE STUDIO",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
    url: "https://lumiere-studio.com",
    telephone: "+1 (212) 847-9200",
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "740 Madison Avenue",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10065",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.767576,
      longitude: -73.966952,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    sameAs: [
      "https://instagram.com/lumiere.studio",
      "https://vogue.com",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <HomeClient
          initialPhotos={sanitizedPhotos}
          initialServices={sanitizedServices}
          initialTestimonials={sanitizedTestimonials}
        />
      </main>
    </>
  );
}
