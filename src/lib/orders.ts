import { nanoid } from "nanoid";
import { createClient } from "@supabase/supabase-js";

// Pakai service role key supaya bisa bypass RLS dari server
// JANGAN taruh ini di NEXT_PUBLIC_ — hanya di server
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diset di env");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface Order {
  orderId:      string;
  pgOrderId:    string | null;
  productId:    string;
  productName:  string;
  amount:       number;
  gameUserId:   string;
  serverId?:    string | null;
  email:        string;
  userId?:      string | null;
  paymentMethod: "qris";
  status:       "pending" | "success" | "failed" | "expired";
  qrisUrl?:     string | null;
  qrisData?:    string | null;
  expiredAt?:   string | null;
  createdAt:    string;
  paidAt?:      string | null;
}

function fromRow(row: any): Order {
  return {
    orderId:      row.order_id,
    pgOrderId:    row.pg_order_id,
    productId:    row.product_id,
    productName:  row.product_name,
    amount:       row.amount,
    gameUserId:   row.game_user_id,
    serverId:     row.server_id,
    email:        row.email,
    userId:       row.user_id,
    paymentMethod: row.payment_method,
    status:       row.status,
    qrisUrl:      row.qris_url,
    qrisData:     row.qris_data,
    expiredAt:    row.expired_at,
    createdAt:    row.created_at,
    paidAt:       row.paid_at,
  };
}

export function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = nanoid(6).toUpperCase();
  return `INV-${date}-${rand}`;
}

export async function saveOrder(order: Order): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("orders").insert({
    order_id:      order.orderId,
    pg_order_id:   order.pgOrderId,
    product_id:    order.productId,
    product_name:  order.productName,
    amount:        order.amount,
    game_user_id:  order.gameUserId,
    server_id:     order.serverId ?? null,
    email:         order.email,
    user_id:       order.userId ?? null,
    payment_method: order.paymentMethod,
    status:        order.status,
    qris_url:      order.qrisUrl ?? null,
    qris_data:     order.qrisData ?? null,
    expired_at:    order.expiredAt ?? null,
    paid_at:       order.paidAt ?? null,
  });
  if (error) throw new Error(`Gagal simpan order: ${error.message}`);
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .single();
  if (error || !data) return null;
  return fromRow(data);
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  extra?: Partial<Pick<Order, "paidAt">>
): Promise<Order | null> {
  const sb = getSupabaseAdmin();
  const updates: any = { status };
  if (extra?.paidAt !== undefined) updates.paid_at = extra.paidAt;

  const { data, error } = await sb
    .from("orders")
    .update(updates)
    .eq("order_id", orderId)
    .select()
    .single();

  if (error || !data) return null;
  return fromRow(data);
}
