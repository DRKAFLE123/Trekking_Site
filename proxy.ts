import { NextRequest, NextResponse } from "next/server";

/**
 * Edge middleware: defense-in-depth security gate that runs before any
 * route handler.
 *
 *   1. Returns 404 for paths that used to host dangerous bootstrap routes
 *      (init, seed-*). They've been deleted, but this stops them from
 *      ever being re-introduced by accident.
 *
 *   2. Cheap in-memory IP rate-limiting on write endpoints. Not perfect
 *      across multiple serverless instances, but raises the bar for the
 *      common case of a single bot hammering one URL.
 *
 * Don't put auth checks here — Payload's auth needs the Node runtime, not
 * the Edge. Keep this lightweight.
 */

// Path patterns that should never exist again.
const FORBIDDEN_PATHS = [
  /^\/api\/init\/?$/,
  /^\/api\/seed-/,
];

// Rate limits for write-y form endpoints. Tuned for a small business site —
// honest users send 1-2 requests, bots send hundreds.
type RateRule = { match: RegExp; max: number; windowMs: number };
const RATE_RULES: RateRule[] = [
  { match: /^\/api\/newsletter\/?$/, max: 5, windowMs: 60_000 },     //  5/min/IP
  { match: /^\/api\/contact\/?$/, max: 10, windowMs: 60_000 },       // 10/min/IP
  { match: /^\/api\/plan-trip\/?$/, max: 10, windowMs: 60_000 },     // 10/min/IP
  { match: /^\/api\/booking\/?$/, max: 10, windowMs: 60_000 },       // 10/min/IP
  { match: /^\/api\/booking-passport\/?$/, max: 12, windowMs: 60_000 }, // 12/min/IP — passport uploads
  // Also rate-limit anonymous writes to Payload's auto endpoints. Even
  // though access control now rejects them, this saves CPU on the rejection.
  { match: /^\/api\/(inquiries|bookings|payments)\/?$/, max: 5, windowMs: 60_000 },
];

// In-memory counter. Cleared on every cold start, which is fine for our
// purposes (each instance enforces independently; an attacker still hits
// the global cap per-instance). For production hardening, swap for Redis.
type Hit = { count: number; resetAt: number };
const hits = new Map<string, Hit>();

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string, rule: RateRule): boolean {
  const key = `${rule.match.source}::${ip}`;
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + rule.windowMs });
    return true;
  }
  if (entry.count >= rule.max) return false;
  entry.count += 1;
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Forbidden paths — return 404 so the URL looks unmounted.
  for (const re of FORBIDDEN_PATHS) {
    if (re.test(pathname)) {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  // 2. Rate-limit only POST/PUT/PATCH/DELETE — GETs are read-only.
  if (req.method !== "GET" && req.method !== "HEAD") {
    for (const rule of RATE_RULES) {
      if (rule.match.test(pathname)) {
        const ip = getClientIp(req);
        if (!checkRateLimit(ip, rule)) {
          return new NextResponse(
            JSON.stringify({ error: "Too many requests. Please slow down." }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": String(Math.ceil(rule.windowMs / 1000)),
              },
            },
          );
        }
        break;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on every API path. Static files and pages are skipped naturally
  // because we early-return next() for non-matching write endpoints.
  matcher: ["/api/:path*"],
};
