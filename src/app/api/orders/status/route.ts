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

  const order = getOrder(orderId);
  if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });

  // Kalau sudah final, return langsung tanpa hit PG
  if (order.status === "success" || order.status === "failed" || order.status === "expired") {
    return NextResponse.json({ status: order.status, order });
  }

  // Cek ke PG
  if (order.pgOrderId) {
    const pgResult = await checkPaymentStatus(order.pgOrderId);
    if (pgResult.ok && pgResult.status && pgResult.status !== "pending") {
      const updated = updateOrderStatus(orderId, pgResult.status, {
        paidAt: pgResult.status === "success" ? new Date().toISOString() : null,
      });
      return NextResponse.json({ status: pgResult.status, order: updated });
    }
  }

  return NextResponse.json({ status: order.status, order });
}
