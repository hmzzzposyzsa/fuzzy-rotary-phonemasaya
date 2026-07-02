// ════════════════════════════════════════════════════════════════
// LAPISAN FETCH KE API EKSTERNAL (server terpisah)
// ════════════════════════════════════════════════════════════════
// Semua data produk, link info, dsb TIDAK disimpan di project ini.
// Diambil dari server API lain lewat NEXT_PUBLIC_API_BASE_URL.
// Tujuannya: project Next.js ini tetap ringan (cuma UI), berat data
// & logic ada di server API kamu sendiri.
//
// Cara pakai:
// 1. Set env var di Vercel / .env.local:
//      NEXT_PUBLIC_API_BASE_URL=https://api.domainkamu.com
// 2. Pastikan API kamu punya endpoint sesuai daftar di bawah
//    (atau ganti path-nya sesuai API asli kamu).
// ════════════════════════════════════════════════════════════════

import type {
  Product,
  Review,
  InfoCategory,
  PaymentMethod,
  SiteConfig,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit & { revalidate?: number } = {}
): Promise<T> {
  if (!API_BASE_URL) {
    // Belum di-set -> lempar error yang jelas, biar gampang debug saat development.
    throw new ApiError(
      `NEXT_PUBLIC_API_BASE_URL belum diset. Tidak bisa fetch ke ${path}`,
      0
    );
  }

  const { revalidate, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(rest.headers || {}),
    },
    // ISR: data di-cache di edge Vercel, refresh tiap `revalidate` detik.
    // Override per-call sesuai kebutuhan (mis. data user pakai cache:no-store).
    next: revalidate !== undefined ? { revalidate } : undefined,
  });

  if (!res.ok) {
    throw new ApiError(`API error ${res.status} pada ${path}`, res.status);
  }

  return res.json() as Promise<T>;
}

// ───── PRODUCTS ─────
export async function getProducts(params?: {
  category?: string;
  search?: string;
}): Promise<Product[]> {
  const qs = new URLSearchParams();
  if (params?.category && params.category !== "Semua")
    qs.set("category", params.category);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString() ? `?${qs.toString()}` : "";

  return apiFetch<Product[]>(`/products${query}`, { revalidate: 60 });
}

export async function getProductById(id: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { revalidate: 60 });
}

export async function getBestSellers(): Promise<Product[]> {
  return apiFetch<Product[]>(`/products?sort=bestseller&limit=3`, {
    revalidate: 60,
  });
}

export async function getProductReviews(
  productId: string
): Promise<Review[]> {
  return apiFetch<Review[]>(`/products/${productId}/reviews`, {
    revalidate: 60,
  });
}

// ───── CATEGORIES ─────
export async function getCategories(): Promise<string[]> {
  return apiFetch<string[]>(`/categories`, { revalidate: 300 });
}

// ───── INFO LINKS (halaman Info, dulunya "Top Up") ─────
export async function getInfoCategories(): Promise<InfoCategory[]> {
  return apiFetch<InfoCategory[]>(`/info-links`, { revalidate: 300 });
}

// ───── PAYMENT METHODS ─────
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return apiFetch<PaymentMethod[]>(`/payment-methods`, { revalidate: 300 });
}

// ───── SITE CONFIG (nama toko, logo, dsb) ─────
export async function getSiteConfig(): Promise<SiteConfig> {
  return apiFetch<SiteConfig>(`/site-config`, { revalidate: 300 });
}

// ───── CHECKOUT / ORDER (contoh POST ke API eksternal) ─────
export interface CreateOrderPayload {
  productId: string | number;
  userId?: string;
  gameUserId: string;
  serverId?: string;
  email: string;
  paymentMethod: string;
}

export interface CreateOrderResponse {
  orderId: string;
  status: "pending" | "success" | "failed";
  paymentUrl?: string;
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  return apiFetch<CreateOrderResponse>(`/orders`, {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export { ApiError, API_BASE_URL };
