import { ShoppingBag, Zap, ShieldCheck, Headphones, TrendingUp } from "lucide-react";

export default function TentangPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(59,126,248,0.3)]">
          <ShoppingBag size={28} className="text-white" />
        </div>
        <h1 className="font-outfit text-3xl font-black mb-3">Tentang Arduyy Shop</h1>
        <p className="text-muted leading-relaxed">
          Platform top up game digital terpercaya untuk semua gamer Indonesia.
          Proses instan, harga terbaik, dan dukungan 24/7.
        </p>
      </div>

      <div className="grid gap-4 mb-8">
        {[
          { icon: Zap,         title: "Proses Instan",        desc: "Top up diproses otomatis dalam hitungan detik, tersedia 24 jam 7 hari seminggu.", color: "text-blue-400 bg-blue-400/10" },
          { icon: ShieldCheck, title: "100% Aman",            desc: "Sistem keamanan berlapis dengan enkripsi SSL dan payment gateway terpercaya.", color: "text-emerald-400 bg-emerald-400/10" },
          { icon: TrendingUp,  title: "Harga Terbaik",        desc: "Kami berkomitmen memberikan harga paling kompetitif di pasar.", color: "text-violet-400 bg-violet-400/10" },
          { icon: Headphones,  title: "Support 24/7",         desc: "Tim CS kami siap membantu kapan saja via WhatsApp, Telegram, dan Email.", color: "text-yellow-400 bg-yellow-400/10" },
        ].map((f) => (
          <div key={f.title} className="flex gap-4 bg-card border border-border rounded-2xl p-5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
              <f.icon size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { value: "50+",   label: "Produk" },
          { value: "25K+",  label: "Transaksi" },
          { value: "4.9★",  label: "Rating" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
            <div className="font-outfit text-2xl font-black text-primary mb-1">{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
