const PG_BASE = (process.env.PAYMENT_BASE_URL || "https://ikkonstore.site/api").replace(/\/$/, "");
const PG_KEY  = process.env.PAYMENT_API_KEY || "";

function pgHeaders() {
  return {
    "X-Api-Key":    PG_KEY,
    "Content-Type": "application/json",
  };
}

export interface CreatePaymentPayload {
  amount:   number;
  itemName: string;
  orderId:  string;
}

export interface CreatePaymentResult {
  ok:         boolean;
  qrisUrl?:   string | null;
  pgOrderId?: string | null;
  expiredAt?: string | null;
  error?:     string;
}

export async function createPayment(p: CreatePaymentPayload): Promise<CreatePaymentResult> {
  try {
    const res = await fetch(`${PG_BASE}/order.php`, {
      method:  "POST",
      headers: pgHeaders(),
      body: JSON.stringify({
        idOrder:   p.orderId,
        hargaAsli: p.amount,
        item:      p.itemName,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `PG error ${res.status}: ${text}` };
    }

    const json = await res.json();
    console.log("[PG createPayment response]", JSON.stringify(json));

    const d = json.data ?? json;
    if (json.success === false) {
      return { ok: false, error: json.message || "PG error" };
    }

    let expiredAt: string | null = null;
    if (d.timestampExpired) {
      expiredAt = new Date(Number(d.timestampExpired) * 1000).toISOString();
    } else if (d.expiredAt) {
      expiredAt = new Date(d.expiredAt.replace(" ", "T") + "+07:00").toISOString();
    }
    if (!expiredAt) {
      expiredAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    }

    return {
      ok:        true,
      qrisUrl:   d.qrisUrl || null,
      pgOrderId: d.idOrder || p.orderId, // simpan idOrder dari PG, fallback ke punya kita
      expiredAt,
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Network error" };
  }
}

export interface CheckStatusResult {
  ok:      boolean;
  status?: "pending" | "success" | "failed" | "expired";
  error?:  string;
}

export async function checkPaymentStatus(idOrder: string): Promise<CheckStatusResult> {
  try {
    const res = await fetch(`${PG_BASE}/check-status.php`, {
      method:  "POST",
      headers: pgHeaders(),
      body:    JSON.stringify({ idOrder }),
    });

    if (!res.ok) return { ok: false, error: `PG error ${res.status}` };

    const json = await res.json();
    console.log("[PG checkStatus response]", JSON.stringify(json));

    // PG return array [{...}] atau object {data:{...}} atau flat {...}
    const raw_data = Array.isArray(json) ? json[0] : (json.data ?? json);
    const raw = (raw_data.status || "PENDING").toUpperCase();

    const map: Record<string, CheckStatusResult["status"]> = {
      SUCCESS: "success", PAID: "success", SETTLEMENT: "success",
      PENDING: "pending", WAITING: "pending",
      FAILED:  "failed",  FAILURE: "failed", DENY: "failed",
      EXPIRED: "expired", CANCEL:  "expired",
    };

    return { ok: true, status: map[raw] ?? "pending" };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Network error" };
  }
}

export async function cancelPayment(idOrder: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${PG_BASE}/cancel.php`, {
      method:  "POST",
      headers: pgHeaders(),
      body:    JSON.stringify({ idOrder }),
    });
    if (!res.ok) return { ok: false, error: `PG error ${res.status}` };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}
