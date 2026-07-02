import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL || "noreply@arduyy.shop";

// Lazy init — hanya dibuat saat dipanggil, bukan saat module di-load
// (menghindari error "Missing API key" saat Next.js build time)
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

// OTP disimpan in-memory (Map<email, {otp, expiresAt}>).
// Di production multi-instance (Vercel serverless), ganti dengan
// Redis (pakai @upstash/redis yang sudah ada) supaya konsisten.
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(email: string): Promise<{ ok: boolean; error?: string }> {
  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 menit

  otpStore.set(email, { otp, expiresAt });

  if (!process.env.RESEND_API_KEY) {
    console.log(`[OTP DEV] ${email} → ${otp}`);
    return { ok: true };
  }

  const resend = getResend()!;
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Kode OTP Arduyy Shop",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#060c1a;color:#e2e8f8;border-radius:16px">
          <h2 style="color:#3b7ef8;margin-top:0">Arduyy Shop</h2>
          <p style="color:#b8c7e8">Gunakan kode OTP berikut untuk verifikasi akun kamu:</p>
          <div style="background:#111d35;border:1px solid rgba(59,126,248,0.2);border-radius:12px;padding:24px;text-align:center;margin:24px 0">
            <span style="font-size:36px;font-weight:900;letter-spacing:12px;color:#3b7ef8">${otp}</span>
          </div>
          <p style="color:#6a85b5;font-size:14px">Kode berlaku selama <strong>5 menit</strong>. Jangan berikan kode ini kepada siapapun.</p>
          <p style="color:#6a85b5;font-size:12px;margin-top:24px">Kalau kamu tidak mendaftar di Arduyy Shop, abaikan email ini.</p>
        </div>
      `,
    });
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Gagal mengirim email" };
  }
}

export function verifyOtp(email: string, otp: string): boolean {
  const entry = otpStore.get(email);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email);
    return false;
  }
  if (entry.otp !== otp) return false;
  otpStore.delete(email); // hapus setelah berhasil dipakai
  return true;
}
