export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { cancelPayment } from "@/lib/payment";

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { success } = await rateLimit(ip, "api");
  if (!success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const orderId = body?.orderId;
  if (!orderId) return NextResponse.json({ error: "orderId diperlukan" }, { status: 400 });

  const order = getOrder(orderId);
  if (!order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
  if (order.status !== "pending") return NextResponse.json({ error: "Order tidak bisa dibatalkan" }, { status: 400 });

  if (order.pgOrderId) await cancelPayment(order.pgOrderId);
  updateOrderStatus(orderId, "expired");

  return NextResponse.json({ ok: true });
}
