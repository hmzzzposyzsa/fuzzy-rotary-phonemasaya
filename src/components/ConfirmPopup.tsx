"use client";

import { X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";

interface ConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  data: {
    productName: string;
    category: string;
    price: number;
    originalPrice?: number | null;
    gameUserId: string;
    serverId?: string;
    email: string;
    paymentMethod: string;
  };
}

export default function ConfirmPopup({
  isOpen, onClose, onConfirm, loading, data,
}: ConfirmPopupProps) {
  if (!isOpen) return null;

  const rows = [
    { label: "Produk",          value: data.productName },
    { label: "Kategori",        value: data.category },
    { label: "Harga",           value: formatRupiah(data.price) },
    { label: "User ID Game",    value: data.gameUserId },
    ...(data.serverId ? [{ label: "Server ID", value: data.serverId }] : []),
    { label: "Email",           value: data.email },
    { label: "Metode Bayar",    value: "QRIS" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400/15 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="font-outfit font-black text-lg">Konfirmasi Pesanan</h2>
              <p className="text-xs text-muted mt-0.5">Pastikan semua data sudah benar sebelum bayar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted hover:text-foreground transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Data rows */}
        <div className="bg-secondary/60 border border-border rounded-2xl overflow-hidden mb-5">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`flex justify-between items-start px-4 py-3 gap-4 ${
                i < rows.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-xs text-muted font-medium shrink-0 w-28">{row.label}</span>
              <span className="text-sm font-semibold text-right break-all">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="bg-yellow-400/8 border border-yellow-400/20 rounded-xl px-4 py-3 mb-5 flex gap-2.5">
          <AlertTriangle size={14} className="text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-300/80 leading-relaxed">
            Pastikan <strong>User ID</strong> dan <strong>Server ID</strong> (jika ada) sudah benar.
            Top up yang sudah berhasil tidak bisa dibatalkan atau di-refund.
          </p>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-5 px-1">
          <span className="text-sm text-muted">Total Pembayaran</span>
          <span className="font-outfit font-black text-xl text-primary">
            {formatRupiah(data.price)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl font-bold text-sm bg-secondary border border-border hover:border-primary/30 transition disabled:opacity-50"
          >
            Revisi Data
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl font-black text-sm bg-primary text-white shadow-[0_8px_24px_rgba(59,126,248,0.3)] hover:bg-[#2d6ef0] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                Lanjut Bayar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
