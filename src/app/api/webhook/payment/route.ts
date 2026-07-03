export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, getOrder } from "@/lib/orders";

// Webhook dari payment gateway — dipanggil PG saat status payment berubah.
// Daftarkan URL ini ke PG: https://shop.arduyy.my.id/api/webhook/payment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ ok: false }, { status: 400 });

    console.log("[Webhook PG]", JSON.stringify(body));

    const idOrder = body.idOrder || body.order_id || body.id;
    const status  = (body.status || "").toUpperCase();

    if (!idOrder) {
      return NextResponse.json({ error: "idOrder tidak ada" }, { status: 400 });
    }

    const map: Record<string, "success" | "failed" | "expired"> = {
      SUCCESS:    "success",
      PAID:       "success",
      SETTLEMENT: "success",
      VERIFIED:   "success",
      FAILED:     "failed",
      EXPIRED:    "expired",
      CANCEL:     "expired",
    };

    const newStatus = map[status];
    if (!newStatus) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const order = await getOrder(idOrder);
    if (!order) {
      console.warn("[Webhook] Order tidak ditemukan:", idOrder);
      return NextResponse.json({ ok: true, not_found: true });
    }

    await updateOrderStatus(order.orderId, newStatus, {
      paidAt: newStatus === "success" ? new Date().toISOString() : null,
    });

    console.log(`[Webhook] Order ${order.orderId} → ${newStatus}`);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[Webhook error]", err?.message);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Webhook endpoint aktif" });
}
