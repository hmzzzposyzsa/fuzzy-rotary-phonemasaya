"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, Star, Zap, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import ConfirmPopup from "@/components/ConfirmPopup";
import type { Product, Review } from "@/types";

type Tab = "info" | "reviews" | "payment";

// Gambar QRIS resmi dari Google
const QRIS_LOGO = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/QRIS_logo.svg/2560px-QRIS_logo.svg.png";

export default function ProductDetailClient({
  product,
  reviews,
}: {
  product: Product;
  reviews: Review[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("info");
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [gameUserId, setGameUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function handleOpenConfirm() {
    setFormError(null);
    if (!gameUserId.trim()) { setFormError("User ID tidak boleh kosong"); return; }
    if (!email.trim())       { setFormError("Email konfirmasi tidak boleh kosong"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFormError("Format email tidak valid"); return; }
    setShowConfirm(true);
  }

  async function handleConfirmPay() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId:     String(product.id),
          gameUserId:    gameUserId.trim(),
          serverId:      serverId.trim() || undefined,
          email:         email.trim().toLowerCase(),
          paymentMethod: "qris",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal membuat pesanan");
        setShowConfirm(false);
        setSubmitting(false);
        return;
      }

      // Redirect ke halaman pembayaran
      const params = new URLSearchParams({
        name:      data.productName || "",
        amount:    String(data.amount || 0),
        expiredAt: data.expiredAt   || "",
        qrisUrl:   data.qrisUrl     || "",
      });
      router.push(`/pembayaran/${data.orderId}?${params.toString()}`);
    } catch {
      setFormError("Terjadi kesalahan. Coba lagi.");
      setShowConfirm(false);
      setSubmitting(false);
    }
  }

  return (
    <>
      <ConfirmPopup
        isOpen={showConfirm}
        onClose={() => { if (!submitting) setShowConfirm(false); }}
        onConfirm={handleConfirmPay}
        loading={submitting}
        data={{
          productName:   product.name,
          category:      product.category,
          price:         product.price,
          originalPrice: product.originalPrice,
          gameUserId:    gameUserId,
          serverId:      serverId || undefined,
          email:         email,
          paymentMethod: "QRIS",
        }}
      />

      {/* TABS */}
      <div className="flex gap-1 bg-secondary border border-border rounded-2xl p-1 mb-6">
        {(
          [
            { id: "info",    label: "Detail Produk" },
            { id: "reviews", label: "Review" },
            { id: "payment", label: "Pembayaran" },
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl text-center transition-all ${
              tab === t.id
                ? "bg-card text-foreground shadow border border-border"
                : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* INFO TAB */}
      {tab === "info" && (
        <div>
          <button
            onClick={() => setAccordionOpen((v) => !v)}
            className="w-full flex items-center justify-between bg-card border border-border rounded-2xl px-5 py-4 font-semibold text-sm mb-2.5 hover:border-primary/50 transition"
          >
            <span className="flex items-center gap-2.5">
              <Zap size={15} className="text-primary" />
              Detail Produk
            </span>
            <span className={`transition-transform duration-200 ${accordionOpen ? "rotate-180" : ""}`}>▾</span>
          </button>
          {accordionOpen && (
            <div className="bg-card border border-border rounded-2xl p-5 mb-2.5">
              <p className="text-sm text-muted leading-relaxed mb-4">{product.description}</p>
              <div className="flex flex-col gap-2.5">
                {product.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-emerald-500" />
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
              <Zap size={14} className="text-primary" /> Cara Top Up
            </h3>
            <ol className="flex flex-col gap-3">
              {[
                "Pilih nominal yang diinginkan",
                "Masukkan User ID & Server ID akun game kamu",
                "Klik Beli Sekarang & konfirmasi data",
                "Scan QRIS dan selesaikan pembayaran",
                "Top up masuk otomatis dalam 1 menit!",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted">
                  <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-[0.7rem] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* REVIEWS TAB */}
      {tab === "reviews" && (
        <div>
          <div className="bg-card border border-border rounded-2xl p-5 flex gap-8 items-center mb-4">
            <div className="text-center shrink-0">
              <div className="font-outfit text-5xl font-black text-primary">{product.rating}</div>
              <div className="text-xs text-muted mt-1">{product.reviewCount.toLocaleString("id-ID")} ulasan</div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {reviews.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 bg-primary/20 text-primary rounded-full flex items-center justify-center font-black text-sm shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <span className="text-xs text-muted">{r.date}</span>
                    </div>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed">{r.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-sm text-muted text-center py-8">Belum ada ulasan.</p>
            )}
          </div>
        </div>
      )}

      {/* PAYMENT TAB */}
      {tab === "payment" && (
        <div>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-sm font-semibold block mb-2">User ID</label>
              <input
                value={gameUserId}
                onChange={(e) => setGameUserId(e.target.value)}
                className="w-full bg-input border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition"
                placeholder="Masukkan User ID"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">
                Server ID <span className="text-muted font-normal">(jika ada)</span>
              </label>
              <input
                value={serverId}
                onChange={(e) => setServerId(e.target.value)}
                className="w-full bg-input border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition"
                placeholder="Contoh: 1234"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-sm font-semibold block mb-2">Email Konfirmasi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-input border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition"
              placeholder="email@contoh.com"
            />
          </div>

          {/* QRIS only */}
          <div className="mb-5">
            <label className="text-sm font-semibold block mb-3">Metode Pembayaran</label>
            <div className="flex items-center gap-4 bg-card border-2 border-primary rounded-2xl px-5 py-4">
              <img src={QRIS_LOGO} alt="QRIS" className="h-7 object-contain" />
              <div>
                <div className="font-bold text-sm">QRIS</div>
                <div className="text-xs text-muted">Scan QR dengan semua aplikasi dompet digital</div>
              </div>
              <CheckCircle2 size={20} className="text-primary ml-auto shrink-0" />
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 mb-5">
            <div className="flex justify-between text-sm mb-2.5">
              <span className="text-muted">{product.name}</span>
              <span className="font-semibold">{formatRupiah(product.price)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2.5">
              <span className="text-muted">Biaya admin</span>
              <span className="font-semibold text-emerald-500">Gratis</span>
            </div>
            <div className="flex justify-between font-black border-t border-border pt-3">
              <span>Total Pembayaran</span>
              <span className="text-primary">{formatRupiah(product.price)}</span>
            </div>
          </div>

          {formError && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5 mb-4">
              {formError}
            </p>
          )}

          <button
            onClick={handleOpenConfirm}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-[0_10px_30px_rgba(59,126,248,0.3)] hover:bg-[#2d6ef0] hover:-translate-y-0.5 transition-all disabled:opacity-60"
          >
            <CreditCard size={16} />
            Beli Sekarang — {formatRupiah(product.price)}
          </button>
        </div>
      )}
    </>
  );
}
