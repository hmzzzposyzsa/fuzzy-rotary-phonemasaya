import { z } from "zod";

// ════════════════════════════════════════════════════════════════
// VALIDASI & SANITASI INPUT — mencegah SQL injection, XSS, dll
// Semua input dari user harus melewati salah satu schema ini sebelum
// diproses lebih lanjut di Route Handler.
// ════════════════════════════════════════════════════════════════

// Karakter berbahaya yang sering dipakai untuk SQL injection / XSS
const DANGEROUS_CHARS = /[<>"'`;\\]/g;

// Sanitasi string: hapus karakter berbahaya, trim whitespace
export function sanitize(input: string): string {
  return input.replace(DANGEROUS_CHARS, "").trim().slice(0, 1000);
}

// ── SCHEMAS ──

export const EmailSchema = z
  .string()
  .email("Format email tidak valid")
  .max(254)
  .transform((v) => v.toLowerCase().trim());

export const PasswordSchema = z
  .string()
  .min(6, "Password minimal 6 karakter")
  .max(128, "Password terlalu panjang");

export const OtpSchema = z
  .string()
  .length(6, "OTP harus 6 digit")
  .regex(/^\d{6}$/, "OTP hanya boleh berisi angka");

export const GameUserIdSchema = z
  .string()
  .min(1, "User ID tidak boleh kosong")
  .max(50, "User ID terlalu panjang")
  .regex(/^[a-zA-Z0-9_\-\.]+$/, "User ID mengandung karakter tidak valid")
  .transform(sanitize);

export const ServerIdSchema = z
  .string()
  .max(20, "Server ID terlalu panjang")
  .regex(/^[a-zA-Z0-9_\-]*$/, "Server ID mengandung karakter tidak valid")
  .optional()
  .transform((v) => (v ? sanitize(v) : undefined));

export const ProductIdSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[a-zA-Z0-9_\-]+$/, "Product ID tidak valid")
  .transform(sanitize);

export const NameSchema = z
  .string()
  .min(1, "Nama tidak boleh kosong")
  .max(100, "Nama terlalu panjang")
  .transform(sanitize);

// Schema untuk request buat order
export const CreateOrderSchema = z.object({
  productId:     ProductIdSchema,
  gameUserId:    GameUserIdSchema,
  serverId:      ServerIdSchema,
  email:         EmailSchema,
  paymentMethod: z.literal("qris"), // hanya QRIS yang diizinkan
  userId:        z.string().uuid().optional(),
});

// Schema untuk register
export const RegisterSchema = z.object({
  name:  NameSchema,
  email: EmailSchema,
  phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{8,13}$/, "Nomor HP tidak valid")
    .optional()
    .or(z.literal("")),
  password: PasswordSchema,
  otp:      OtpSchema,
});

// Schema untuk send OTP
export const SendOtpSchema = z.object({
  email: EmailSchema,
});

// Schema untuk login
export const LoginSchema = z.object({
  email:    EmailSchema,
  password: PasswordSchema,
});

// Helper: parse dan return error yang rapi
export function parseBody<T>(
  schema: z.ZodType<T>,
  body: unknown
): { data: T; error: null } | { data: null; error: string } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const msg = result.error.errors.map((e) => e.message).join(", ");
    return { data: null, error: msg };
  }
  return { data: result.data, error: null };
}
