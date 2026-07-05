"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, RefreshCw, X, QrCode, ShieldCheck } from "lucide-react";
import { formatRupiah } from "@/lib/format";

interface OrderData {
  orderId:     string;
  productName: string;
  amount:      number;
  qrisUrl:     string | null;
  expiredAt:   string | null;
  status:      "pending" | "success" | "failed" | "expired";
}

function useCountdown(expiredAt: string | null) {
  const calc = () =>
    expiredAt
      ? Math.max(0, Math.floor((new Date(expiredAt).getTime() - Date.now()) / 1000))
      : 0;

  const [seconds, setSeconds] = useState(calc);

  useEffect(() => {
    if (!expiredAt) return;
    setSeconds(calc());
    const iv = setInterval(() => setSeconds(calc()), 1000);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiredAt]);

  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return { display: `${m}:${s}`, expired: seconds === 0 && expiredAt !== null };
}

export default function PaymentPageClient({ orderId }: { orderId: string }) {
  const router      = useRouter();
  const params      = useSearchParams();
  const fetchedOnce = useRef(false);

  const [order, setOrder] = useState<OrderData>({
    orderId,
    productName: params.get("name")      || "",
    amount:      Number(params.get("amount") || 0),
    qrisUrl:     params.get("qrisUrl")   || null,
    expiredAt:   params.get("expiredAt") || null,
    status:      "pending",
  });

  const [cancelling, setCancelling] = useState(false);
  const { display: countdown, expired: isExpired } = useCountdown(order.expiredAt);

  const fetchStatus = useCallback(async () => {
    try {
      const res  = await fetch(`/api/orders/status?orderId=${orderId}`);
      // kalau rate limited, skip update tapi jangan stop polling
      if (res.status === 429) return;
      if (!res.ok) return;
      const data = await res.json();

      const newStatus = data.status as OrderData["status"];

      setOrder((prev) => ({
        ...prev,
        status:      newStatus                    ?? prev.status,
        qrisUrl:     data.order?.qrisUrl          ?? prev.qrisUrl,
        expiredAt:   data.order?.expiredAt        ?? prev.expiredAt,
        productName: data.order?.productName      ?? prev.productName,
        amount:      data.order?.amount           ?? prev.amount,
      }));

      if (newStatus === "success") {
        router.push(`/pembayaran/${orderId}/success`);
      }
    } catch {
      // polling error — abaikan, lanjut
    }
  }, [orderId, router]);

  // Fetch sekali langsung saat mount untuk sync data dari Supabase
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    fetchStatus();
  }, [fetchStatus]);

  // Polling tiap 3 detik
  useEffect(() => {
    const iv = setInterval(fetchStatus, 3000);
    return () => clearInterval(iv);
  }, [fetchStatus]);

  async function handleCancel() {
    setCancelling(true);
    await fetch("/api/orders/cancel", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ orderId }),
    });
    router.push("/produk");
  }

  const isExpiredStatus =
    order.status === "expired" ||
    order.status === "failed"  ||
    (isExpired && order.expiredAt !== null);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-outfit text-2xl font-black text-center mb-2">
        Selesaikan Pembayaran
      </h1>
      <p className="text-muted text-sm text-center mb-6">
        Scan QRIS di bawah menggunakan aplikasi dompet digital apapun
      </p>

      <div className="bg-card border border-border rounded-3xl overflow-hidden mb-6">
        {/* Info order */}
        <div className="px-5 py-4 border-b border-border space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted">No. Invoice</span>
            <span className="font-mono font-semibold text-xs">{orderId}</span>
          </div>
          {order.productName && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">Produk</span>
              <span className="font-semibold text-right max-w-[60%] truncate">{order.productName}</span>
            </div>
          )}
          {order.amount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">Total</span>
              <span className="font-black text-primary">{formatRupiah(order.amount)}</span>
            </div>
          )}
        </div>

        {/* Countdown — hanya tampil kalau expiredAt ada dan belum expired */}
        {!isExpiredStatus && order.expiredAt && (
          <div className="flex items-center justify-center gap-2 py-3 bg-yellow-400/8 border-b border-border">
            <Clock size={14} className="text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">
              Bayar dalam: <span className="font-mono">{countdown}</span>
            </span>
          </div>
        )}

        {/* QRIS */}
        <div className="p-6 flex flex-col items-center">
          {isExpiredStatus ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-3">
                <X size={28} className="text-red-400" />
              </div>
              <p className="font-bold text-red-400 mb-1">Waktu Pembayaran Habis</p>
              <p className="text-xs text-muted">QR Code sudah tidak berlaku</p>
            </div>
          ) : order.qrisUrl ? (
            <>
              <div className="bg-white p-3 rounded-2xl mb-3 shadow-lg">
                <img
                  src={order.qrisUrl}
                  alt="QRIS Payment"
                  className="w-56 h-56 object-contain"
                />
              </div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/QRIS_logo.svg/2560px-QRIS_logo.svg.png"
                alt="QRIS"
                className="h-6 object-contain opacity-80"
              />
            </>
          ) : (
            <div className="py-8 text-center text-muted">
              <QrCode size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Memuat QRIS...</p>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-border flex items-center justify-center gap-2">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span className="text-xs text-muted">Pembayaran aman &amp; terenkripsi</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={fetchStatus}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-[#2d6ef0] transition"
        >
          <RefreshCw size={15} />
          Cek Status Pembayaran
        </button>
        {!isExpiredStatus && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full py-3 rounded-2xl font-semibold text-sm text-muted border border-border hover:border-red-400/30 hover:text-red-400 transition disabled:opacity-50"
          >
            {cancelling ? "Membatalkan..." : "Batalkan Pesanan"}
          </button>
        )}
        {isExpiredStatus && (
          <button
            onClick={() => router.push("/produk")}
            className="w-full py-3 rounded-2xl font-semibold text-sm border border-border hover:border-primary/30 transition"
          >
            Kembali ke Produk
          </button>
        )}
      </div>

      <p className="text-center text-xs text-muted mt-5">
        Status diperbarui otomatis setiap 3 detik
      </p>
    </div>
  );
}
