import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Lumière Studio database...");

  // 1. Seed Admin User
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@lumiere.com";
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "admin123";
  const isDefaultPassword = adminPassword === "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Julian Vance (Creative Director)",
      mustChangePassword: isDefaultPassword,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Julian Vance (Creative Director)",
      role: "ADMIN",
      mustChangePassword: isDefaultPassword,
    },
  });
  console.log(`Admin user seeded: ${adminEmail} (Enforce password change: ${isDefaultPassword})`);

  // 2. Studio Settings
  await prisma.studioSetting.upsert({
    where: { id: "studio_config" },
    update: {
      studioName: "LUMIÈRE STUDIO",
      tagline: "Where every frame tells a beautiful story.",
      heroHeading: "CAPTURING TIMELESS MOMENTS.",
      phone: "+1 (212) 847-9200",
      email: "concierge@lumiere-studio.com",
      address: "740 Madison Avenue, New York, NY 10065",
      parisAddress: "18 Rue du Faubourg Saint-Honoré, 75008 Paris",
      instagramUrl: "https://instagram.com/lumiere.studio",
      awardsCount: 28,
      yearsExperience: 14,
      eventsCount: 420,
      clientsRating: 4.98,
    },
    create: {
      id: "studio_config",
      studioName: "LUMIÈRE STUDIO",
      tagline: "Where every frame tells a beautiful story.",
      heroHeading: "CAPTURING TIMELESS MOMENTS.",
      phone: "+1 (212) 847-9200",
      email: "concierge@lumiere-studio.com",
      address: "740 Madison Avenue, New York, NY 10065",
      parisAddress: "18 Rue du Faubourg Saint-Honoré, 75008 Paris",
      instagramUrl: "https://instagram.com/lumiere.studio",
      awardsCount: 28,
      yearsExperience: 14,
      eventsCount: 420,
      clientsRating: 4.98,
    },
  });

  // 3. Clear and re-populate Photos
  await prisma.photo.deleteMany({});

  const photos = [
    // Wedding
    {
      title: "The Chateau Serenade",
      category: "Wedding",
      description: "Intimate bridal veil portrait illuminated by twilight lanterns on Lake Como.",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Hasselblad H6D-100c",
      lensInfo: "HC 2,2/100mm",
      aperture: "f/2.2",
      location: "Villa Balbianello, Lake Como",
      year: "2025",
      orientation: "portrait",
      featured: true,
      order: 1,
    },
    {
      title: "Veil of Eternity",
      category: "Wedding",
      description: "Haute couture silk gown catching early morning Tuscan mist.",
      imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Leica M11",
      lensInfo: "Noctilux 50mm f/0.95",
      aperture: "f/1.2",
      location: "Castello di Vicarello, Tuscany",
      year: "2025",
      orientation: "portrait",
      featured: true,
      order: 2,
    },
    {
      title: "Golden Hour Vows",
      category: "Wedding",
      description: "Dramatic lakeside terrace ceremony during golden hour sunset.",
      imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Sony A1",
      lensInfo: "FE 85mm f/1.4 GM",
      aperture: "f/1.6",
      location: "Grand Hotel Tremezzo, Italy",
      year: "2024",
      orientation: "landscape",
      featured: false,
      order: 3,
    },
    {
      title: "Palazzo Reverie",
      category: "Wedding",
      description: "Romantic stroll beneath ancient Cypress trees in the Italian countryside.",
      imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Hasselblad X2D 100C",
      lensInfo: "XCD 55mm f/2.5 V",
      aperture: "f/2.8",
      location: "Florence, Italy",
      year: "2024",
      orientation: "landscape",
      featured: true,
      order: 4,
    },

    // Fashion
    {
      title: "Vogue Haute Couture No. 4",
      category: "Fashion",
      description: "High fashion editorial feature exploring texture, drape and golden hour shadow.",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Hasselblad H6D-100c",
      lensInfo: "HC 100mm f/2.2",
      aperture: "f/2.8",
      location: "Paris Fashion Week, Paris",
      year: "2025",
      orientation: "portrait",
      featured: true,
      order: 5,
    },
    {
      title: "Avant-Garde Drape",
      category: "Fashion",
      description: "Sculptural silhouette commissioned for Autumn Paris Fashion Week cover story.",
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Phase One IQ4 150MP",
      lensInfo: "Schneider Kreuznach 80mm LS",
      aperture: "f/3.5",
      location: "Grand Palais Éphémère, Paris",
      year: "2025",
      orientation: "portrait",
      featured: true,
      order: 6,
    },
    {
      title: "Monochrome Elegance",
      category: "Fashion",
      description: "Contemporary street couture captured with natural light reflections in Milan.",
      imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Leica SL2",
      lensInfo: "APO-Summicron 50mm f/2",
      aperture: "f/2.0",
      location: "Galleria Vittorio Emanuele, Milan",
      year: "2024",
      orientation: "portrait",
      featured: false,
      order: 7,
    },
    {
      title: "Velvet Horizon",
      category: "Fashion",
      description: "Luxury ready-to-wear editorial for international luxury department store.",
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Canon R5",
      lensInfo: "RF 50mm f/1.2 L USM",
      aperture: "f/1.4",
      location: "Place Vendôme, Paris",
      year: "2024",
      orientation: "landscape",
      featured: true,
      order: 8,
    },

    // Portrait
    {
      title: "The Sculptor's Gaze",
      category: "Portrait",
      description: "Fine art chiaroscuro studio study exploring depth, soul, and vulnerability.",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Phase One XF",
      lensInfo: "Schneider 110mm f/2.8",
      aperture: "f/2.8",
      location: "Lumière Tribeca Atelier, NY",
      year: "2025",
      orientation: "portrait",
      featured: true,
      order: 9,
    },
    {
      title: "Gentleman of Mayfair",
      category: "Portrait",
      description: "Bespoke tailoring portrait commissioned for Savile Row craftsman profile.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Leica M11",
      lensInfo: "Summilux-M 50mm f/1.4",
      aperture: "f/1.8",
      location: "Mayfair, London",
      year: "2025",
      orientation: "portrait",
      featured: false,
      order: 10,
    },
    {
      title: "Aura in Shadows",
      category: "Portrait",
      description: "Monochrome natural light study focusing on expressive bone structure.",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Hasselblad 907X 50C",
      lensInfo: "XCD 45mm f/4 P",
      aperture: "f/4.0",
      location: "Montmartre Atelier, Paris",
      year: "2024",
      orientation: "portrait",
      featured: true,
      order: 11,
    },
    {
      title: "Golden Hour Grace",
      category: "Portrait",
      description: "Warm amber glow bathing a contemplative gaze over the Manhattan skyline.",
      imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Sony A1",
      lensInfo: "FE 135mm f/1.8 GM",
      aperture: "f/1.8",
      location: "Upper East Side, New York",
      year: "2024",
      orientation: "portrait",
      featured: false,
      order: 12,
    },

    // Nature
    {
      title: "Misty Valley Solitude",
      category: "Nature",
      description: "Dawn breaking over granite spires shrouded in primeval alpine clouds.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Hasselblad X2D 100C",
      lensInfo: "XCD 38mm f/2.5 V",
      aperture: "f/8.0",
      location: "Yosemite National Park, California",
      year: "2024",
      orientation: "landscape",
      featured: true,
      order: 13,
    },
    {
      title: "Alpine Reverence",
      category: "Nature",
      description: "First sunlight touching jagged peaks above tranquil reflective alpine tarn.",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Sony A7R V",
      lensInfo: "FE 70-200mm f/2.8 GM II",
      aperture: "f/5.6",
      location: "Dolomites, Northern Italy",
      year: "2025",
      orientation: "landscape",
      featured: false,
      order: 14,
    },
    {
      title: "Cathedral of Light",
      category: "Nature",
      description: "Sun rays cascading through thousand-year-old redwood trees in morning dew.",
      imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Fujifilm GFX 100 II",
      lensInfo: "GF 32-64mm f/4",
      aperture: "f/8.0",
      location: "Pacific Northwest, Oregon",
      year: "2024",
      orientation: "portrait",
      featured: true,
      order: 15,
    },
    {
      title: "Whispers of Black Forest",
      category: "Nature",
      description: "Atmospheric fine art landscape depicting emerald moss and misty pines.",
      imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Leica SL2",
      lensInfo: "Vario-Elmarit 24-70mm",
      aperture: "f/5.6",
      location: "Bavaria, Germany",
      year: "2024",
      orientation: "landscape",
      featured: false,
      order: 16,
    },

    // Commercial
    {
      title: "High Jewelry Luminance",
      category: "Commercial",
      description: "Fine jewelry campaign showcasing precision cuts, diamond fire, and gold textures.",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Hasselblad H6D-100c",
      lensInfo: "HC Macro 120mm f/4",
      aperture: "f/11",
      location: "Place Vendôme Atelier, Paris",
      year: "2025",
      orientation: "landscape",
      featured: true,
      order: 17,
    },
    {
      title: "Swiss Horology Precision",
      category: "Commercial",
      description: "Minimalist timepiece campaign emphasizing mechanical complications and sapphire crystal.",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Phase One IQ4 150MP",
      lensInfo: "Schneider 120mm Macro",
      aperture: "f/14",
      location: "Geneva, Switzerland",
      year: "2025",
      orientation: "square",
      featured: true,
      order: 18,
    },
    {
      title: "L'Élixir Flacon",
      category: "Commercial",
      description: "Artisanal haute parfumerie campaign exploring light refraction through crystal.",
      imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Sony A1",
      lensInfo: "FE 90mm f/2.8 Macro G OSS",
      aperture: "f/8.0",
      location: "Grasse, France",
      year: "2024",
      orientation: "portrait",
      featured: false,
      order: 19,
    },
    {
      title: "Nordic Acoustic Craft",
      category: "Commercial",
      description: "Minimalist industrial design photography capturing matte metallic finishes.",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Leica SL2",
      lensInfo: "APO-Macro-Elmarit 90mm",
      aperture: "f/5.6",
      location: "Copenhagen, Denmark",
      year: "2024",
      orientation: "landscape",
      featured: false,
      order: 20,
    },

    // Events
    {
      title: "Cannes Festival Gala",
      category: "Events",
      description: "Red carpet arrivals and private afterparty during the International Film Festival.",
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Leica M11",
      lensInfo: "Summilux 28mm f/1.4",
      aperture: "f/1.8",
      location: "Hôtel du Cap-Eden-Roc, Antibes",
      year: "2025",
      orientation: "landscape",
      featured: true,
      order: 21,
    },
    {
      title: "The Midnight Soirée",
      category: "Events",
      description: "Candid moments of laughter and champagne toasts at an exclusive black-tie gala.",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Sony A1",
      lensInfo: "FE 35mm f/1.4 GM",
      aperture: "f/1.4",
      location: "Palais Garnier, Paris",
      year: "2025",
      orientation: "landscape",
      featured: true,
      order: 22,
    },
    {
      title: "Venice Biennale Vernissage",
      category: "Events",
      description: "Private patron preview inside a 16th century palazzo overlooking the Grand Canal.",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Hasselblad X2D",
      lensInfo: "XCD 28mm f/4 P",
      aperture: "f/4.0",
      location: "Palazzo Grassi, Venice",
      year: "2024",
      orientation: "landscape",
      featured: false,
      order: 23,
    },
    {
      title: "Met Gala Secret Ball",
      category: "Events",
      description: "Euphoric celebration and golden confetti showering VIP guests in Manhattan.",
      imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1600",
      cameraModel: "Canon R5",
      lensInfo: "RF 28-70mm f/2 L USM",
      aperture: "f/2.0",
      location: "The Carlyle Hotel, New York",
      year: "2024",
      orientation: "landscape",
      featured: false,
      order: 24,
    },
  ];

  for (const photo of photos) {
    await prisma.photo.create({ data: photo });
  }
  console.log(`Seeded ${photos.length} curated luxury photos.`);

  // 4. Clear and populate Services
  await prisma.service.deleteMany({});

  const services = [
    {
      slug: "wedding-haute-couture",
      name: "Wedding Haute Couture",
      tag: "Signature Masterpiece",
      subtitle: "For grand destination weddings and private historic estates",
      description:
        "A multi-day visual chronicle crafted like a cinematic monograph. Dual principal photographers capturing intimate, fleeting moments alongside grand architectural vistas using medium-format cameras and genuine analog film.",
      priceStarting: "$8,500",
      duration: "Full Weekend Coverage",
      deliverables:
        "800+ Hand-Retouched Masterpieces, 120mm Analog Film Keepsakes, Handcrafted Tuscan Leather Album, 48-Hour Sneak Peek Preview, Drone Aerials",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
      order: 1,
      active: true,
    },
    {
      slug: "fashion-editorial",
      name: "Fashion & Editorial",
      tag: "Vogue & Runway",
      subtitle: "Lookbooks, magazine covers, and international brand campaigns",
      description:
        "Runway, lookbook, and campaign visual direction powered by Hasselblad 100MP medium-format fidelity. Full studio lighting architecture, meticulous on-set art direction, and world-class haute digital color grading.",
      priceStarting: "$6,200",
      duration: "Full Day / Campaign",
      deliverables:
        "Full Commercial Usage Rights, Bespoke Color Grading Suite, Creative Direction Moodboard, High-Res Retouched TIFFs",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1600",
      order: 2,
      active: true,
    },
    {
      slug: "personal-portraits",
      name: "Fine-Art Personal Portraits",
      tag: "Atelier Session",
      subtitle: "Sculptural lighting, chiaroscuro, timeless character",
      description:
        "Intimate studio sessions tailored for private collectors, executives, artists, and families. Designed to capture profound presence, vulnerability, and timeless elegance reminiscent of classical Renaissance portraiture.",
      priceStarting: "$2,800",
      duration: "3 - 4 Hours",
      deliverables:
        "25 Museum-Grade Master Prints, Hand-Finished Retouching, Wardrobe & Stylist Consultation, Archival Folio Presentation Box",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1600",
      order: 3,
      active: true,
    },
    {
      slug: "commercial-luxury",
      name: "Commercial & Luxury Goods",
      tag: "Horology & Haute Joaillerie",
      subtitle: "Swiss timepieces, high jewelry, perfumes & architectural spaces",
      description:
        "Macro precision and tactile lighting for luxury goods, Swiss timepieces, fine jewelry, fragrance, and interior architecture. Engineered to captivate discerning audiences across global print and digital mediums.",
      priceStarting: "$5,500",
      duration: "Per Project / Campaign",
      deliverables:
        "Global Commercial Licensing, 8K Ultra-Sharp Deliverables, Focus Stacking Macro Mastery, Color Matched Master Files",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1600",
      order: 4,
      active: true,
    },
    {
      slug: "pre-wedding-cinematic",
      name: "Pre-Wedding Cinematic",
      tag: "Destination Love Story",
      subtitle: "Romantic visual poetry in Paris, Lake Como, Amalfi or Tokyo",
      description:
        "A private visual journey through the world's most romantic destinations. Styled editorial shoots combining tender intimacy with sweeping architectural grandeur, immortalizing the anticipation of your union.",
      priceStarting: "$4,200",
      duration: "1 - 2 Days",
      deliverables:
        "150 Hand-Graded Visuals, Stylist Moodboard, Destination Logistics Assistance, Short Cinematic Teaser Film",
      imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1600",
      order: 5,
      active: true,
    },
    {
      slug: "gala-vip-events",
      name: "Gala & VIP Events",
      tag: "High Society",
      subtitle: "Charity galas, private soirées, international festivals",
      description:
        "Unobtrusive yet comprehensive documentary coverage of prestigious gatherings, VIP receptions, private dinners, and international film festivals. Capturing candid grandeur with editorial poise.",
      priceStarting: "$3,800",
      duration: "Evening / Day Coverage",
      deliverables:
        "Live Sneak Peek for PR Within 6 Hours, Complete Red Carpet & Candid Coverage, High-Res Download Hub",
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600",
      order: 6,
      active: true,
    },
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }
  console.log(`Seeded ${services.length} luxury services.`);

  // 5. Testimonials
  await prisma.testimonial.deleteMany({});

  const testimonials = [
    {
      clientName: "Countess Alessandra & Lord Henry",
      clientRole: "Private Client",
      eventType: "Haute Couture Wedding",
      venue: "Villa d'Este, Lake Como",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      rating: 5,
      quote:
        "Lumière Studio captured our Lake Como wedding with such breathtaking intimacy and majesty. Seeing our album brought tears to our eyes; it felt like flipping through Italian Vogue. Every photograph is a museum piece.",
      featured: true,
      order: 1,
    },
    {
      clientName: "Vivienne Laurent",
      clientRole: "Creative Director",
      eventType: "Fall/Winter Campaign",
      venue: "Maison Laurent Paris, Place Vendôme",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
      rating: 5,
      quote:
        "Working with Julian and the Lumière team for our Paris Fashion Week campaign was an absolute masterclass. Their command of light, silhouette, and tactile drape elevated our collection to international critical acclaim.",
      featured: true,
      order: 2,
    },
    {
      clientName: "Dr. Jonathan Sterling",
      clientRole: "Collector & Philanthropist",
      eventType: "Private Atelier Portraiture",
      venue: "Lumière Tribeca Studio, New York",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      rating: 5,
      quote:
        "The portrait session in their Tribeca atelier was truly transformative. Subtle, powerful, and utterly timeless. My family and grandchildren will cherish these prints for generations to come.",
      featured: true,
      order: 3,
    },
    {
      clientName: "Isabelle & Marc De Vries",
      clientRole: "Gala Chairs",
      eventType: "Cannes Red Carpet Gala",
      venue: "Hôtel du Cap-Eden-Roc, Antibes",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300",
      rating: 5,
      quote:
        "Discreet, exceptionally professional, and undeniably artistic. They documented our private gala without missing a single candid emotion, delivering PR selects in time for morning headlines.",
      featured: true,
      order: 4,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`Seeded ${testimonials.length} testimonials.`);

  // 6. Bookings
  await prisma.booking.deleteMany({});

  const sampleBookings = [
    {
      reference: "LUM-2026-8812",
      fullName: "Lady Eleanor Kensington",
      email: "eleanor.kensington@mayfair-holdings.co.uk",
      phone: "+44 20 7946 0912",
      service: "Wedding Haute Couture",
      preferredDate: "2026-09-18",
      location: "Villa Balbianello, Lake Como, Italy",
      guestCount: "120 guests",
      message: "We are hosting our three-day wedding celebration at Lake Como. Seeking full analog and digital coverage.",
      status: "CONFIRMED",
      notes: "VIP Client. Arranged preliminary briefing via Zoom. Contract signed.",
    },
    {
      reference: "LUM-2026-9041",
      fullName: "Sebastian Thorne",
      email: "sthorne@thorne-architects.com",
      phone: "+1 (212) 555-0199",
      service: "Fashion & Editorial",
      preferredDate: "2026-10-05",
      location: "SoHo Penthouse Atelier, New York",
      guestCount: "15 models & crew",
      message: "Autumn campaign for luxury cashmere and structured outerwear line.",
      status: "PENDING",
      notes: "Pending moodboard approval and date confirmation.",
    },
    {
      reference: "LUM-2026-7629",
      fullName: "Camille de Montmirail",
      email: "camille@montmirail-art.fr",
      phone: "+33 1 42 68 55 00",
      service: "Fine-Art Personal Portraits",
      preferredDate: "2026-08-14",
      location: "18 Rue du Faubourg Saint-Honoré, Paris",
      guestCount: "Solo session",
      message: "Looking for classical chiaroscuro portrait for upcoming retrospective catalog.",
      status: "COMPLETED",
      notes: "Archival folio delivered. 5-star review received.",
    },
  ];

  for (const b of sampleBookings) {
    await prisma.booking.create({ data: b });
  }
  console.log(`Seeded ${sampleBookings.length} sample bookings.`);

  // 7. Contact Inquiries
  await prisma.contactInquiry.deleteMany({});

  const sampleInquiries = [
    {
      fullName: "Charlotte Dupont",
      email: "charlotte.dupont@vogue.fr",
      phone: "+33 6 12 34 56 78",
      subject: "Feature Inquiry - Autumn Bridal Edition",
      message:
        "Bonjour, we are compiling our annual Haute Couture destination bridal edition and would love to feature the Lake Como villa coverage by Julian Vance. Could you send the high-res press kit?",
      isRead: false,
    },
    {
      fullName: "Marcus Sterling",
      email: "marcus@sterling-holdings.com",
      phone: "+1 (415) 890-2341",
      subject: "Private Yacht Commission - Monaco Grand Prix",
      message:
        "Inquiring about availability for a private weekend gathering aboard our yacht during Monaco race week.",
      isRead: true,
    },
  ];

  for (const inq of sampleInquiries) {
    await prisma.contactInquiry.create({ data: inq });
  }
  console.log(`Seeded ${sampleInquiries.length} contact inquiries.`);

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

