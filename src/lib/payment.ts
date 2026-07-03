const PG_BASE = (process.env.PAYMENT_BASE_URL || "https://ikkonstore.site/api").replace(/\/$/, "");
const PG_KEY  = process.env.PAYMENT_API_KEY || "";

function pgHeaders() {
  return {
    "X-Api-Key":    PG_KEY,
    "Content-Type": "application/json",
  };
}

export interface CreatePaymentPayload {
  amount:       number;
  itemName:     string;
  orderId:      string;
  customerEmail?: string;
}

export interface CreatePaymentResult {
  ok:         boolean;
  qrisUrl?:   string | null;
  qrisData?:  string | null;
  pgOrderId?: string | null;
  expiredAt?: string | null;
  error?:     string;
}

export async function createPayment(payload: CreatePaymentPayload): Promise<CreatePaymentResult> {
  try {
    const res = await fetch(`${PG_BASE}/order.php`, {
      method:  "POST",
      headers: pgHeaders(),
      body:    JSON.stringify({
        hargaAsli: payload.amount,
        item:      payload.itemName,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `PG error ${res.status}: ${text}` };
    }

    const json = await res.json();
    console.log("[PG createPayment response]", JSON.stringify(json));

    if (!json.success || !json.data) {
      return { ok: false, error: json.message || "PG mengembalikan error" };
    }

    const d = json.data;

    // expiredAt dari PG: "2026-07-03 01:08:56" (WIB/+07:00) → ISO
    let expiredAt: string | null = null;
    if (d.expiredAt) {
      expiredAt = new Date(d.expiredAt.replace(" ", "T") + "+07:00").toISOString();
    } else if (d.timestampExpired) {
      expiredAt = new Date(Number(d.timestampExpired) * 1000).toISOString();
    }

    return {
      ok:        true,
      qrisUrl:   d.qrisUrl  || null,
      qrisData:  d.qrisData || null,
      pgOrderId: d.idOrder  || null,
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

export async function checkPaymentStatus(pgOrderId: string): Promise<CheckStatusResult> {
  try {
    const res = await fetch(`${PG_BASE}/check-status.php`, {
      method:  "POST",
      headers: pgHeaders(),
      body:    JSON.stringify({ idOrder: pgOrderId }),
    });

    if (!res.ok) return { ok: false, error: `PG error ${res.status}` };

    const json = await res.json();
    console.log("[PG checkStatus response]", JSON.stringify(json));

    const d   = json.data || json;
    const raw = (d.status || json.status || "PENDING").toUpperCase();

    const statusMap: Record<string, CheckStatusResult["status"]> = {
      SUCCESS:    "success",
      PAID:       "success",
      SETTLEMENT: "success",
      PENDING:    "pending",
      WAITING:    "pending",
      FAILED:     "failed",
      FAILURE:    "failed",
      DENY:       "failed",
      EXPIRED:    "expired",
      CANCEL:     "expired",
    };

    return { ok: true, status: statusMap[raw] ?? "pending" };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Network error" };
  }
}

export async function cancelPayment(pgOrderId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${PG_BASE}/cancel.php`, {
      method:  "POST",
      headers: pgHeaders(),
      body:    JSON.stringify({ idOrder: pgOrderId }),
    });
    if (!res.ok) return { ok: false, error: `PG error ${res.status}` };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}
    return { ok: true, status: statusMap[raw] ?? "pending" };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Network error" };
  }
}

// ── Cancel ──
export async function cancelPayment(pgOrderId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${PG_BASE}/cancel.php`, {
      method: "POST",
      headers: pgHeaders(),
      body: JSON.stringify({ idOrder: pgOrderId }),
    });
    if (!res.ok) return { ok: false, error: `PG error ${res.status}` };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
}
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
