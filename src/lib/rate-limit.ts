import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Buat Redis client — credentials dari env var yang diisi dari Upstash dashboard
function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// Rate limiter untuk berbagai aksi:
// - api: request umum ke route handler (10 req / 10 detik per IP)
// - auth: login/register (5 req / 1 menit per IP)
// - otp: kirim OTP (3 req / 5 menit per IP)
// - payment: buat order (3 req / 1 menit per IP)

export type LimiterType = "api" | "auth" | "otp" | "payment";

const configs: Record<LimiterType, { requests: number; window: string }> = {
  api:     { requests: 10, window: "10 s" },
  auth:    { requests: 5,  window: "1 m"  },
  otp:     { requests: 3,  window: "5 m"  },
  payment: { requests: 3,  window: "1 m"  },
};

const limiters = new Map<LimiterType, Ratelimit>();

function getLimiter(type: LimiterType): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  if (!limiters.has(type)) {
    const { requests, window } = configs[type];
    limiters.set(
      type,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(requests, window as any),
        prefix: `arduyy:rl:${type}`,
      })
    );
  }
  return limiters.get(type)!;
}

export async function rateLimit(
  identifier: string,
  type: LimiterType = "api"
): Promise<{ success: boolean; reset: number; remaining: number }> {
  const limiter = getLimiter(type);

  // Kalau Upstash belum dikonfigurasi, biarkan lewat (jangan block user)
  if (!limiter) {
    return { success: true, reset: 0, remaining: 999 };
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    reset: result.reset,
    remaining: result.remaining,
  };
}

// Helper: ambil IP dari Next.js request headers
export function getIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}
