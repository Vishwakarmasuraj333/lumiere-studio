import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

async function runAudit() {
  console.log("==================================================");
  console.log("   LUMIÈRE STUDIO — AUDIT TEST RUNNER             ");
  console.log("==================================================\n");

  const results = {
    passed: [],
    failed: [],
  };

  async function test(name, fn) {
    try {
      process.stdout.write(`• Testing: ${name}... `);
      await fn();
      console.log(`PASSED \x1b[32m✓\x1b[0m`);
      results.passed.push(name);
    } catch (err) {
      console.log(`FAILED \x1b[31m✗\x1b[0m: ${err.message}`);
      results.failed.push({ name, error: err.message });
    }
  }

  // 1. Static & Public pages
  await test("Homepage (GET /) returns 200 with HTML and Brand JSON-LD", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("LUMIÈRE STUDIO"), "Should contain LUMIÈRE STUDIO");
    assert.ok(html.includes("PhotographyBusiness"), "Should contain JSON-LD Schema");
  });

  await test("Admin Login Page (GET /admin/login) returns 200", async () => {
    const res = await fetch(`${BASE_URL}/admin/login`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Staff Authentication") || html.includes("LUMIÈRE"), "Should contain login UI");
  });

  await test("Robots & Sitemap endpoints", async () => {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    assert.strictEqual(robotsRes.status, 200);
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    assert.strictEqual(sitemapRes.status, 200);
  });

  // 2. Public API Endpoints
  await test("GET /api/photos returns 200 with photography archive", async () => {
    const res = await fetch(`${BASE_URL}/api/photos`);
    assert.strictEqual(res.status, 200);
    const photos = await res.json();
    assert.ok(Array.isArray(photos) && photos.length > 0, "Photos list should not be empty");
  });

  await test("GET /api/services returns 200 with luxury services", async () => {
    const res = await fetch(`${BASE_URL}/api/services`);
    assert.strictEqual(res.status, 200);
    const services = await res.json();
    assert.ok(Array.isArray(services) && services.length > 0, "Services list should not be empty");
  });

  await test("GET /api/testimonials returns 200 with client testimonials", async () => {
    const res = await fetch(`${BASE_URL}/api/testimonials`);
    assert.strictEqual(res.status, 200);
    const testimonials = await res.json();
    assert.ok(Array.isArray(testimonials) && testimonials.length > 0, "Testimonials should not be empty");
  });

  await test("GET /api/studio returns 200 with studio settings", async () => {
    const res = await fetch(`${BASE_URL}/api/studio`);
    assert.strictEqual(res.status, 200);
    const studio = await res.json();
    assert.strictEqual(studio.id, "studio_config");
  });

  // 3. Booking Form submission and spam defense
  let createdBookingId = null;
  await test("POST /api/bookings blocks honeypot spam bot traps", async () => {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Spam Bot",
        email: "bot@spammer.com",
        phone: "+1234567890",
        service: "Wedding Haute Couture",
        preferredDate: "2026-11-20",
        location: "Spamville",
        honeypot: "I am a malicious automated bot",
      }),
    });
    assert.strictEqual(res.status, 400);
  });

  await test("POST /api/bookings validates required fields & phone/email", async () => {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "A", // too short
        email: "not-an-email",
        phone: "123",
        service: "",
        preferredDate: "",
        location: "",
      }),
    });
    assert.strictEqual(res.status, 400);
  });

  await test("POST /api/bookings creates valid booking with reference code", async () => {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Audrey Hepburn Estate",
        email: "concierge@hepburn-legacy.ch",
        phone: "+41 21 855 0192",
        service: "Private Destination Monograph",
        preferredDate: "2026-09-18",
        location: "Lake Geneva, Switzerland",
        guestCount: "Intimate Monograph",
        message: "Exclusive private monograph shooting in 65mm medium format film.",
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data.booking?.reference.startsWith("LUM-2026-"), "Reference format check");
    createdBookingId = data.booking.id;
  });

  // 4. Contact Form submission
  let createdContactId = null;
  await test("POST /api/contact validates input and creates inquiry", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Charlotte de Bourbon",
        email: "charlotte.bourbon@elysee.fr",
        phone: "+33 1 42 68 55 00",
        subject: "Palais Garnier Editorial Collaboration",
        message: "We would like to discuss private staging for an upcoming Autumn feature.",
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data.inquiry?.id, "Should return created inquiry");
    createdContactId = data.inquiry.id;
  });

  // 5. Authentication & Authorization
  let sessionCookie = null;
  await test("POST /api/auth/login rejects invalid credentials", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@lumiere.com",
        password: "WrongPassword999!",
      }),
    });
    assert.strictEqual(res.status, 401);
  });

  await test("POST /api/auth/login succeeds with seeded credentials and sets HTTP-only cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@lumiere.com",
        password: "admin123",
      }),
    });
    assert.strictEqual(res.status, 200);
    const cookies = res.headers.get("set-cookie");
    assert.ok(cookies && cookies.includes("lumiere_admin_session"), "Cookie header present");
    sessionCookie = cookies;
    const data = await res.json();
    assert.strictEqual(data.user.email, "admin@lumiere.com");
    assert.strictEqual(data.user.mustChangePassword, true, "Must flag password change requirement");
  });

  await test("Protected endpoints reject unauthenticated requests (401)", async () => {
    const statsRes = await fetch(`${BASE_URL}/api/admin/stats`);
    assert.strictEqual(statsRes.status, 401);

    const bookingsRes = await fetch(`${BASE_URL}/api/bookings`);
    assert.strictEqual(bookingsRes.status, 401);
  });

  await test("Protected endpoints succeed with session cookie", async () => {
    const statsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(statsRes.status, 200);
    const stats = await statsRes.json();
    assert.ok(stats.totalBookings >= 1, "Should count bookings");
  });

  await test("GET /api/auth/me returns current authenticated admin", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.authenticated, true);
    assert.strictEqual(data.user.email, "admin@lumiere.com");
  });

  // 6. Enforce password changes & replace demo credentials
  const newPassphrase = "UltraSecure2026!Studio";
  await test("POST /api/auth/change-password validates complexity", async () => {
    // Too simple (no uppercase or digits)
    const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        currentPassword: "admin123",
        newPassword: "short",
      }),
    });
    assert.strictEqual(res.status, 400);
  });

  await test("POST /api/auth/change-password successfully updates admin passphrase", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        currentPassword: "admin123",
        newPassword: newPassphrase,
      }),
    });
    assert.strictEqual(res.status, 200);
    const refreshedCookie = res.headers.get("set-cookie");
    if (refreshedCookie) sessionCookie = refreshedCookie;
  });

  await test("Login with old demo password fails after update", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@lumiere.com",
        password: "admin123",
      }),
    });
    assert.strictEqual(res.status, 401);
  });

  await test("Login with new strong passphrase succeeds", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@lumiere.com",
        password: newPassphrase,
      }),
    });
    assert.strictEqual(res.status, 200);
    sessionCookie = res.headers.get("set-cookie");
    const data = await res.json();
    assert.strictEqual(data.user.mustChangePassword, false, "Must no longer require password change");
  });

  // 7. Booking status modification & inquiry updates
  if (createdBookingId) {
    await test("PUT /api/bookings/:id updates booking status in database", async () => {
      const res = await fetch(`${BASE_URL}/api/bookings/${createdBookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookie,
        },
        body: JSON.stringify({
          status: "CONFIRMED",
          notes: "Tuscan leather monograph package verified with client concierge.",
        }),
      });
      assert.strictEqual(res.status, 200);
      const updated = await res.json();
      assert.strictEqual(updated.status, "CONFIRMED");
    });
  }

  if (createdContactId) {
    await test("PUT /api/contact/:id marks inquiry as read", async () => {
      const res = await fetch(`${BASE_URL}/api/contact/${createdContactId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookie,
        },
        body: JSON.stringify({ isRead: true }),
      });
      assert.strictEqual(res.status, 200);
      const updated = await res.json();
      assert.strictEqual(updated.isRead, true);
    });
  }

  // 8. Studio Configuration persistence
  await test("PUT /api/studio updates studio configuration persistently", async () => {
    const res = await fetch(`${BASE_URL}/api/studio`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        studioName: "LUMIÈRE STUDIO",
        tagline: "Where every frame tells an extraordinary story.",
        heroHeading: "CAPTURING TIMELESS MOMENTS.",
        phone: "+1 (212) 847-9200",
        email: "concierge@lumiere-studio.com",
        address: "740 Madison Avenue, New York, NY 10065",
        parisAddress: "18 Rue du Faubourg Saint-Honoré, 75008 Paris",
        instagramUrl: "https://instagram.com/lumiere.studio",
        awardsCount: 29,
        yearsExperience: 14,
        eventsCount: 425,
        clientsRating: 4.99,
      }),
    });
    assert.strictEqual(res.status, 200);
    const updated = await res.json();
    assert.strictEqual(updated.awardsCount, 29);
  });

  // 9. Logout
  await test("POST /api/auth/logout clears authentication cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(res.status, 200);
  });

  console.log("\n==================================================");
  console.log(`TOTAL PASSED: ${results.passed.length}`);
  console.log(`TOTAL FAILED: ${results.failed.length}`);
  console.log("==================================================");

  if (results.failed.length > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
