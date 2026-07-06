export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { checkPaymentStatus } from "@/lib/payment";

export async function GET(req: NextRequest) {
  const ip = getIp(req);
  const { success } = await rateLimit(ip, "api");
  if (!success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "orderId diperlukan" }, { status: 400 });

  const order = await getOrder(orderId);
  if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });

  // Supabase sudah final — langsung return, JANGAN hit PG
  if (order.status === "success" || order.status === "failed" || order.status === "expired") {
    return NextResponse.json({ status: order.status, order });
  }

  // Masih pending di Supabase — cek PG sebagai fallback
  // tapi HANYA update kalau PG bilang SUCCESS/FAILED/EXPIRED
  // kalau PG masih PENDING, tetap return status dari Supabase (pending)
  if (order.pgOrderId) {
    const pgResult = await checkPaymentStatus(order.pgOrderId);
    if (pgResult.ok && pgResult.status === "success") {
      const updated = await updateOrderStatus(orderId, "success", {
        paidAt: new Date().toISOString(),
      });
      return NextResponse.json({ status: "success", order: updated ?? order });
    }
    if (pgResult.ok && (pgResult.status === "failed" || pgResult.status === "expired")) {
      const updated = await updateOrderStatus(orderId, pgResult.status);
      return NextResponse.json({ status: pgResult.status, order: updated ?? order });
    }
  }

  // Tetap pending
  return NextResponse.json({ status: "pending", order });
}
