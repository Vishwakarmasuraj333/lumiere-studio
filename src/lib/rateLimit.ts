import { NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory token store for sliding window rate limiting
const tokenStore = new Map<string, RateLimitRecord>();

// Clean up expired tokens periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of tokenStore.entries()) {
      if (now > record.resetTime) {
        tokenStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  intervalMs?: number; // Time window in milliseconds (default: 60s)
  maxRequests?: number; // Max requests allowed per window (default: 20)
  prefix?: string; // Optional namespace for differentiating endpoints
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

export function checkRateLimit(
  request: Request,
  options: RateLimitOptions = {}
): { allowed: boolean; limit: number; remaining: number; reset: number } {
  const intervalMs = options.intervalMs || 60 * 1000;
  const maxRequests = options.maxRequests || 20;
  const prefix = options.prefix || "global";

  const ip = getClientIp(request);
  const key = `${prefix}:${ip}`;
  const now = Date.now();

  const record = tokenStore.get(key);

  if (!record || now > record.resetTime) {
    // Window expired or new client
    tokenStore.set(key, {
      count: 1,
      resetTime: now + intervalMs,
    });
    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: Math.ceil((now + intervalMs) / 1000),
    };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      reset: Math.ceil(record.resetTime / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    reset: Math.ceil(record.resetTime / 1000),
  };
}

export function rateLimitResponse(limit: number, reset: number) {
  return NextResponse.json(
    {
      error: "Too many requests. Please slow down and try again later.",
      retryAfter: Math.max(1, reset - Math.ceil(Date.now() / 1000)),
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.max(1, reset - Math.ceil(Date.now() / 1000))),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(reset),
      },
    }
  );
}
