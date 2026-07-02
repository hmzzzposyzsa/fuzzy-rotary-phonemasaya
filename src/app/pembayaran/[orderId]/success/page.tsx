"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Download, Home, Package, Clock, Mail } from "lucide-react";
import { formatRupiah } from "@/lib/format";

interface Order {
  orderId:     string;
  productName: string;
  category?:   string;
  amount:      number;
  gameUserId:  string;
  serverId?:   string;
  email:       string;
  paymentMethod: string;
  status:      string;
  createdAt:   string;
  paidAt?:     string | null;
}

export default function PaymentSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/status?orderId=${params.orderId}`)
      .then((r) => r.json())
      .then((d) => {
        setOrder(d.order);
        setLoading(false);
        // Kalau belum sukses, redirect ke halaman bayar
        if (d.status !== "success") {
          router.replace(`/pembayaran/${params.orderId}`);
        }
      })
      .catch(() => setLoading(false));
  }, [params.orderId, router]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-24 text-muted">Order tidak ditemukan.</div>;
  }

  const paidTime = order.paidAt
    ? new Date(order.paidAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })
    : new Date(order.createdAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });

  return (
    <div className="max-w-lg mx-auto">
      {/* Success banner */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-emerald-500/20">
          <CheckCircle2 size={36} className="text-emerald-500" />
        </div>
        <h1 className="font-outfit text-3xl font-black mb-2">Pembayaran Berhasil!</h1>
        <p className="text-muted">
          Top up kamu sedang diproses dan akan masuk dalam <strong className="text-foreground">1–2 menit</strong>.
        </p>
      </div>

      {/* Invoice card */}
      <div
        id="invoice"
        className="bg-card border border-border rounded-3xl overflow-hidden mb-6 print:border-0 print:shadow-none"
      >
        {/* Invoice header */}
        <div className="bg-primary/10 border-b border-border px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium mb-1">INVOICE</p>
              <p className="font-mono font-bold text-sm">{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted mb-1">Tanggal Bayar</p>
              <p className="text-xs font-semibold">{paidTime}</p>
            </div>
          </div>
        </div>

        {/* Detail rows */}
        <div className="px-6 py-5">
          <div className="space-y-3 mb-5">
            {[
              { icon: Package, label: "Produk",    value: order.productName },
              { icon: Clock,   label: "Status",    value: "✅ Sukses",          cls: "text-emerald-500 font-bold" },
              { icon: Mail,    label: "Email",     value: order.email },
            ].map((row, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <row.icon size={13} className="text-primary" />
                </div>
                <div className="flex-1 flex justify-between items-start">
                  <span className="text-xs text-muted">{row.label}</span>
                  <span className={`text-sm font-semibold text-right max-w-[60%] ${row.cls || ""}`}>
                    {row.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Game info box */}
          <div className="bg-secondary/60 border border-border rounded-2xl p-4 mb-5">
            <p className="text-xs text-muted font-medium mb-3">Data Akun Game</p>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">User ID</span>
              <span className="font-bold font-mono">{order.gameUserId}</span>
            </div>
            {order.serverId && (
              <div className="flex justify-between text-sm">
                <span className="text-muted">Server ID</span>
                <span className="font-bold font-mono">{order.serverId}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted">Metode Bayar</span>
              <span className="text-sm font-semibold">QRIS</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted">Biaya Admin</span>
              <span className="text-sm font-semibold text-emerald-500">Gratis</span>
            </div>
            <div className="flex justify-between items-center font-black text-lg mt-3 pt-3 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatRupiah(order.amount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 text-center">
          <p className="text-xs text-muted">
            Terima kasih telah berbelanja di <strong className="text-foreground">Arduyy Shop</strong>
          </p>
          <p className="text-xs text-muted mt-1">
            Butuh bantuan? Hubungi CS kami di halaman{" "}
            <a href="/info" className="text-primary hover:underline">Info & Layanan</a>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 border border-border rounded-2xl py-3.5 font-semibold text-sm hover:border-primary/40 transition"
        >
          <Download size={15} />
          Unduh Invoice
        </button>
        <button
          onClick={() => router.push("/")}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white rounded-2xl py-3.5 font-bold text-sm hover:bg-[#2d6ef0] transition"
        >
          <Home size={15} />
          Kembali ke Beranda
        </button>
      </div>

      <style>{`
        @media print {
          body > *:not(#invoice) { display: none !important; }
          #invoice { margin: 0; }
        }
      `}</style>
    </div>
  );
}
