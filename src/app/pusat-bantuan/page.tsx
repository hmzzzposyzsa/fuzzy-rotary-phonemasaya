import Link from "next/link";
import { MessageCircle, Send, Mail, FileQuestion, RefreshCw, ShieldCheck } from "lucide-react";

const channels = [
  { icon: MessageCircle, title: "WhatsApp CS", desc: "Respon cepat, aktif 24/7", href: "https://wa.me/6281234567890", badge: "Tercepat", color: "text-emerald-400 bg-emerald-400/10" },
  { icon: Send,          title: "Telegram",    desc: "Chat langsung dengan tim kami", href: "https://t.me/arduyy_shop", badge: null, color: "text-sky-400 bg-sky-400/10" },
  { icon: Mail,          title: "Email",       desc: "cs@arduyy.shop", href: "mailto:cs@arduyy.shop", badge: null, color: "text-primary bg-primary/10" },
];

const guides = [
  { icon: FileQuestion, title: "FAQ",              desc: "Pertanyaan yang sering ditanyakan", href: "/faq" },
  { icon: RefreshCw,    title: "Kebijakan Refund", desc: "Syarat dan proses pengembalian dana", href: "/kebijakan-refund" },
  { icon: ShieldCheck,  title: "Keamanan Akun",    desc: "Tips menjaga keamanan akun kamu", href: "/faq" },
];

export default function PusatBantuanPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-outfit text-3xl font-black mb-2">Pusat Bantuan</h1>
      <p className="text-muted mb-8">Ada yang bisa kami bantu? Pilih channel yang paling nyaman untuk kamu.</p>

      <h2 className="font-bold text-sm mb-4">Hubungi CS Kami</h2>
      <div className="grid gap-3 mb-8">
        {channels.map((c) => (
          <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
              <c.icon size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{c.title}</span>
                {c.badge && <span className="text-[0.6rem] font-bold bg-emerald-400/15 text-emerald-400 rounded-md px-1.5 py-0.5">{c.badge}</span>}
              </div>
              <span className="text-xs text-muted">{c.desc}</span>
            </div>
            <span className="text-muted text-sm">→</span>
          </a>
        ))}
      </div>

      <h2 className="font-bold text-sm mb-4">Panduan Bantuan</h2>
      <div className="grid gap-3">
        {guides.map((g) => (
          <Link key={g.title} href={g.href}
            className="flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <g.icon size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{g.title}</div>
              <div className="text-xs text-muted">{g.desc}</div>
            </div>
            <span className="text-muted text-sm">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
