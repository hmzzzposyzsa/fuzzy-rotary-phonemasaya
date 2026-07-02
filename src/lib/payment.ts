// ════════════════════════════════════════════════════════════════
// INTEGRASI PAYMENT GATEWAY — ikkonstore.site
// Semua call ke PG dilakukan dari server (Route Handler), TIDAK dari
// browser, supaya API key tidak ter-expose ke publik.
// ════════════════════════════════════════════════════════════════

const PG_BASE = (process.env.PAYMENT_BASE_URL || "https://ikkonstore.site/api").replace(/\/$/, "");
const PG_KEY  = process.env.PAYMENT_API_KEY || "";

function pgHeaders() {
  return {
    "X-Api-Key":    PG_KEY,
    "Content-Type": "application/json",
  };
}

// ── Create Order (buat QRIS) ──
export interface CreatePaymentPayload {
  amount:      number;   // harga dalam Rupiah
  itemName:    string;   // nama produk
  orderId:     string;   // ID unik order kita (untuk tracking)
  customerEmail?: string;
}

export interface CreatePaymentResult {
  ok:          boolean;
  qrisUrl?:    string;   // URL gambar QRIS
  qrisData?:   string;   // raw QRIS string (opsional)
  pgOrderId?:  string;   // ID order dari sisi PG
  expiredAt?:  string;   // ISO timestamp expired
  error?:      string;
}

export async function createPayment(
  payload: CreatePaymentPayload
): Promise<CreatePaymentResult> {
  try {
    const res = await fetch(`${PG_BASE}/order.php`, {
      method: "POST",
      headers: pgHeaders(),
      body: JSON.stringify({
        hargaAsli: payload.amount,
        item:      payload.itemName,
        // tambahkan field opsional lain kalau PG kamu support
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `PG error ${res.status}: ${text}` };
    }

    const data = await res.json();

    // DEBUG — bisa dilihat di Vercel Functions logs
    // Hapus baris ini setelah field mapping sudah benar
    console.log("[PG createPayment response]", JSON.stringify(data));

    // Sesuaikan field mapping di bawah dengan response asli dari PG kamu.
    return {
      ok:         true,
      qrisUrl:    data.qris_url    || data.qrisUrl    || data.image_url
                  || data.qr_url  || data.url         || data.data?.qris_url
                  || data.data?.url || null,
      qrisData:   data.qris_data   || data.qrisData   || data.qr_string
                  || data.data?.qris_data || null,
      pgOrderId:  data.order_id    || data.orderId    || data.id
                  || data.data?.order_id || null,
      expiredAt:  data.expired_at  || data.expiredAt  || data.expire
                  || data.expired  || data.data?.expired_at || null,
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Network error" };
  }
}

// ── Check Status ──
export interface CheckStatusResult {
  ok:      boolean;
  status?: "pending" | "success" | "failed" | "expired";
  error?:  string;
}

export async function checkPaymentStatus(
  pgOrderId: string
): Promise<CheckStatusResult> {
  try {
    const res = await fetch(`${PG_BASE}/check-status.php`, {
      method: "POST",
      headers: pgHeaders(),
      body: JSON.stringify({ order_id: pgOrderId }),
    });

    if (!res.ok) {
      return { ok: false, error: `PG error ${res.status}` };
    }

    const data = await res.json();
    console.log("[PG checkStatus response]", JSON.stringify(data));

    const raw = (data.status || data.payment_status || data.data?.status || "pending").toLowerCase();

    const statusMap: Record<string, CheckStatusResult["status"]> = {
      success: "success", paid: "success", settlement: "success",
      pending: "pending", waiting: "pending",
      failed: "failed",  failure: "failed", deny: "failed",
      expired: "expired", cancel: "expired",
    };

    return { ok: true, status: statusMap[raw] ?? "pending" };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Network error" };
  }
}

// ── Cancel Order ──
export async function cancelPayment(pgOrderId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${PG_BASE}/cancel.php`, {
      method: "POST",
      headers: pgHeaders(),
      body: JSON.stringify({ order_id: pgOrderId }),
    });
    if (!res.ok) return { ok: false, error: `PG error ${res.status}` };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}
