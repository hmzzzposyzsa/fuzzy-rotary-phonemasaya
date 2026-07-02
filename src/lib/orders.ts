import { nanoid } from "nanoid";

// ════════════════════════════════════════════════════════════════
// ORDER STORE — in-memory (reset tiap deploy di Vercel Serverless).
// Untuk produksi, ganti dengan database (Supabase table / external DB).
// ════════════════════════════════════════════════════════════════

export interface Order {
  orderId:      string;  // internal ID kita, e.g. "INV-20260702-AB12CD"
  pgOrderId:    string | null;  // ID dari payment gateway
  productId:    string;
  productName:  string;
  amount:       number;
  gameUserId:   string;
  serverId?:    string;
  email:        string;
  userId?:      string;
  paymentMethod: "qris";
  status:       "pending" | "success" | "failed" | "expired";
  qrisUrl?:     string | null;
  qrisData?:    string | null;
  expiredAt?:   string | null;
  createdAt:    string;
  paidAt?:      string | null;
}

// Map<orderId, Order>
const orderStore = new Map<string, Order>();

export function generateOrderId(): string {
  const now  = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = nanoid(6).toUpperCase();
  return `INV-${date}-${rand}`;
}

export function saveOrder(order: Order): void {
  orderStore.set(order.orderId, order);
}

export function getOrder(orderId: string): Order | null {
  return orderStore.get(orderId) ?? null;
}

export function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  extra?: Partial<Order>
): Order | null {
  const order = orderStore.get(orderId);
  if (!order) return null;
  const updated = { ...order, status, ...extra };
  orderStore.set(orderId, updated);
  return updated;
}
