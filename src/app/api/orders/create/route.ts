export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { parseBody, CreateOrderSchema } from "@/lib/validation";
import { createPayment } from "@/lib/payment";
import { generateOrderId, saveOrder } from "@/lib/orders";
import { getProductById } from "@/lib/api";

export async function POST(req: NextRequest) {
  // Rate limit: max 3 order per menit per IP
  const ip = getIp(req);
  const { success, reset } = await rateLimit(ip, "payment");
  if (!success) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Tunggu sebentar." },
      { status: 429, headers: { "X-RateLimit-Reset": String(reset) } }
    );
  }

  const body = await req.json().catch(() => null);
  const { data, error } = parseBody(CreateOrderSchema, body);
  if (error || !data) return NextResponse.json({ error: error ?? "Invalid body" }, { status: 400 });

  // Ambil detail produk dari API eksternal untuk validasi harga
  let product: Awaited<ReturnType<typeof getProductById>>;
  try {
    product = await getProductById(data.productId);
  } catch {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }

  const orderId = generateOrderId();

  // Buat pembayaran QRIS via payment gateway
  const pgResult = await createPayment({
    amount:        product.price,
    itemName:      product.name,
    orderId,
    customerEmail: data.email,
  });

  if (!pgResult.ok) {
    return NextResponse.json(
      { error: pgResult.error || "Gagal membuat pembayaran" },
      { status: 502 }
    );
  }

  // Simpan order ke store
  saveOrder({
    orderId,
    pgOrderId:     pgResult.pgOrderId ?? null,
    productId:     data.productId,
    productName:   product.name,
    amount:        product.price,
    gameUserId:    data.gameUserId,
    serverId:      data.serverId,
    email:         data.email,
    userId:        data.userId,
    paymentMethod: "qris",
    status:        "pending",
    qrisUrl:       pgResult.qrisUrl ?? null,
    qrisData:      pgResult.qrisData ?? null,
    expiredAt:     pgResult.expiredAt ?? null,
    createdAt:     new Date().toISOString(),
    paidAt:        null,
  });

  return NextResponse.json({
    ok:      true,
    orderId,
    qrisUrl:  pgResult.qrisUrl,
    qrisData: pgResult.qrisData,
    expiredAt: pgResult.expiredAt,
    amount:   product.price,
    productName: product.name,
  });
}
