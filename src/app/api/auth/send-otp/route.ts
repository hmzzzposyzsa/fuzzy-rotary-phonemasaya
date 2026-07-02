export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { sendOtp } from "@/lib/otp";
import { parseBody, SendOtpSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  // Rate limit: max 3 kirim OTP per 5 menit per IP
  const ip = getIp(req);
  const { success, reset } = await rateLimit(ip, "otp");
  if (!success) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi dalam beberapa menit." },
      { status: 429, headers: { "X-RateLimit-Reset": String(reset) } }
    );
  }

  const body = await req.json().catch(() => null);
  const { data, error } = parseBody(SendOtpSchema, body);
  if (error || !data) return NextResponse.json({ error: error ?? "Invalid body" }, { status: 400 });

  const result = await sendOtp(data.email);
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Gagal kirim OTP" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "OTP dikirim ke email kamu" });
}
