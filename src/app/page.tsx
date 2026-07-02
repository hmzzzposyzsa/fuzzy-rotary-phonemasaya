import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Headphones, Package, TrendingUp, Users, Star, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getBestSellers } from "@/lib/api";
import type { Product } from "@/types";

export const revalidate = 60;

export default async function DashboardPage() {
  // Data diambil dari API eksternal. Kalau API belum jalan / env belum
  // diset, kita tangkap errornya dan tampilkan state kosong yang ramah,
  // bukan crash seluruh halaman.
  let bestSellers: Product[] = [];
  let apiError = false;
  try {
    bestSellers = await getBestSellers();
  } catch {
    apiError = true;
  }

  return (
    <div>
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-border p-10 sm:p-14 mb-12 bg-gradient-to-br from-[#0d1b3e] via-background to-[#0a1629]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary/20 blur-[60px]" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-blue-900/20 blur-[60px]" />
          <div className="absolute inset-0 hero-grid-bg" />
        </div>
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 rounded-full px-3.5 py-1.5 text-xs font-bold text-primary mb-5">
            <Sparkles size={11} />
            Top Up Terpercaya &amp; Tercepat #1
          </div>
          <h1 className="font-outfit text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-4">
            Welcome to
            <br />
            <span className="text-primary">Arduyy Shop</span>
          </h1>
          <p className="text-muted leading-relaxed mb-7">
            Platform top up game digital terpercaya dengan ribuan transaksi
            sukses setiap hari. Cepat, aman, dan harga terbaik.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/produk"
              className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-[0_10px_30px_rgba(59,126,248,0.35)] hover:bg-[#2d6ef0] hover:-translate-y-0.5 transition-all"
            >
              Lihat Produk
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/info"
              className="inline-flex items-center gap-2 bg-white/8 border border-white/20 text-white px-7 py-3.5 rounded-2xl font-bold text-sm backdrop-blur hover:bg-white/13 transition-all"
            >
              Info Layanan
            </Link>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Package, value: "50+", label: "Total Produk", color: "text-blue-400 bg-blue-400/10" },
          { icon: TrendingUp, value: "25K+", label: "Transaksi Sukses", color: "text-emerald-400 bg-emerald-400/10" },
          { icon: Users, value: "8.5K+", label: "Pengguna Aktif", color: "text-violet-400 bg-violet-400/10" },
          { icon: Star, value: "4.9 ★", label: "Rating Rata-rata", color: "text-yellow-400 bg-yellow-400/10" },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:-translate-y-0.5 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div className="font-outfit text-2xl font-black mb-0.5">{s.value}</div>
            <div className="text-xs text-muted font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <div className="bg-card border border-border rounded-2xl p-8 mb-12">
        <div className="flex items-center gap-2.5 font-outfit text-lg font-black mb-7">
          <ShieldCheck className="text-primary" size={20} />
          Mengapa Memilih Arduyy Shop?
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Zap, title: "Proses Instan", desc: "Top up otomatis dalam hitungan detik, tersedia 24 jam 7 hari seminggu tanpa gangguan sistem.", color: "text-blue-400 bg-blue-400/10" },
            { icon: ShieldCheck, title: "100% Aman & Terpercaya", desc: "Sistem keamanan berlapis dengan enkripsi SSL. Lebih dari 25.000 transaksi berhasil setiap bulannya.", color: "text-emerald-400 bg-emerald-400/10" },
            { icon: Headphones, title: "Support 24/7", desc: "Tim CS kami siap membantu kapan saja melalui WhatsApp, live chat, dan email. Respon cepat.", color: "text-violet-400 bg-violet-400/10" },
          ].map((f, i) => (
            <div key={i} className="flex gap-4">
              <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${f.color}`}>
                <f.icon size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BEST SELLERS */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5 font-outfit text-lg font-black">
            <Star className="fill-yellow-400 text-yellow-400" size={20} />
            Produk Best Seller
          </div>
          <Link href="/produk" className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-75">
            Lihat Semua
            <ArrowRight size={14} />
          </Link>
        </div>

        {apiError ? (
          <div className="text-center py-16 text-muted bg-card border border-border rounded-2xl">
            <p className="font-semibold mb-1">Belum terhubung ke API</p>
            <p className="text-sm">
              Set <code className="text-primary">NEXT_PUBLIC_API_BASE_URL</code> di environment variable untuk menampilkan produk.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="text-center mt-7">
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-[0_10px_28px_rgba(59,126,248,0.3)] hover:bg-[#2d6ef0] hover:-translate-y-0.5 transition-all"
          >
            <Package size={16} />
            See More Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
