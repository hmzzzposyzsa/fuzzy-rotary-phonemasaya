export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { verifyOtp } from "@/lib/otp";
import { parseBody, OtpSchema, EmailSchema } from "@/lib/validation";
import { z } from "zod";

const Schema = z.object({ email: EmailSchema, otp: OtpSchema });

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { success } = await rateLimit(ip, "auth");
  if (!success) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Tunggu sebentar." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const { data, error } = parseBody(Schema, body);
  if (error || !data) return NextResponse.json({ error: error ?? "Invalid body" }, { status: 400 });

  const valid = verifyOtp(data.email, data.otp);
  if (!valid) {
    return NextResponse.json({ error: "OTP salah atau sudah kadaluarsa" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
