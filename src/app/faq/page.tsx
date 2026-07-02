"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Berapa lama proses top up?", a: "Proses top up kami umumnya berlangsung kurang dari 1 menit secara otomatis. Pada kondisi server ramai, maksimal 5 menit." },
  { q: "Apakah transaksi di Arduyy Shop aman?", a: "Ya, 100% aman. Kami menggunakan sistem enkripsi SSL dan payment gateway terpercaya. Ribuan transaksi berhasil setiap harinya." },
  { q: "Bagaimana jika top up gagal?", a: "Jika top up gagal, saldo Anda akan dikembalikan secara penuh (100% refund) dalam waktu 1x24 jam ke metode pembayaran asal." },
  { q: "Metode pembayaran apa yang tersedia?", a: "Saat ini kami menerima QRIS — bisa digunakan dengan semua aplikasi dompet digital (GoPay, OVO, DANA, ShopeePay, dan semua bank yang support QRIS)." },
  { q: "Bagaimana cara menggunakan QRIS?", a: "Setelah checkout, akan muncul QR Code. Buka aplikasi dompet digital kamu, pilih Scan QR, arahkan ke QR Code, dan konfirmasi pembayaran." },
  { q: "Apakah ada diskon untuk pembelian dalam jumlah besar?", a: "Ya! Untuk pembelian di atas Rp 500.000, Anda mendapatkan diskon otomatis 5%. Hubungi CS kami untuk penawaran bulk order lebih lanjut." },
  { q: "Bagaimana jika saya memasukkan User ID yang salah?", a: "Pastikan User ID dan Server ID yang kamu masukkan sudah benar sebelum melakukan pembayaran. Top up yang sudah diproses tidak bisa dibatalkan." },
  { q: "Apakah akun saya aman?", a: "Kami menggunakan Supabase Auth untuk sistem keamanan akun, dengan enkripsi password standar industri. Kami tidak pernah menyimpan password dalam bentuk plain text." },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-outfit text-3xl font-black mb-2">FAQ</h1>
      <p className="text-muted mb-8">Pertanyaan yang sering diajukan tentang Arduyy Shop</p>
      <div className="space-y-2.5">
        {faqs.map((f, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm hover:bg-primary/5 transition"
            >
              <span>{f.q}</span>
              <ChevronDown size={16} className={`text-muted shrink-0 ml-4 transition-transform ${open === i ? "rotate-180 text-primary" : ""}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-muted leading-relaxed border-t border-border pt-3">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
