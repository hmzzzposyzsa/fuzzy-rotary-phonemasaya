import Link from "next/link";
import { Instagram, Twitter, Youtube, Music2, ShoppingBag } from "lucide-react";

const footerLinks = [
  {
    title: "Layanan",
    links: [
      { label: "Semua Produk",    href: "/produk" },
      { label: "Info & Bantuan",  href: "/info" },
      { label: "Pusat Bantuan",   href: "/pusat-bantuan" },
      { label: "FAQ",             href: "/faq" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami",       href: "/tentang" },
      { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
      { label: "Kebijakan Privasi",  href: "/kebijakan-privasi" },
      { label: "Kebijakan Refund",   href: "/kebijakan-refund" },
    ],
  },];

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter,   href: "#", label: "Twitter" },
  { icon: Music2,    href: "#", label: "TikTok" },
  { icon: Youtube,   href: "#", label: "YouTube" },
];

const bottomLinks = [
  { label: "Kebijakan Privasi",  href: "/kebijakan-privasi" },
  { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
  { label: "Kebijakan Refund",   href: "/kebijakan-refund" },
  { label: "FAQ",                href: "/faq" },
  { label: "Sitemap",            href: "#" },
];

export default function Footer({ siteName }: { siteName: string }) {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-[1200px] mx-auto px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr] mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(59,126,248,0.3)]">
                <ShoppingBag size={15} className="text-white" />
              </div>
              <span className="font-outfit font-black text-lg">{siteName}</span>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-5">
              Platform top up game digital terpercaya. Proses cepat, aman,
              dan harga terbaik untuk semua gamer Indonesia.
            </p>
            <div className="flex gap-2 mb-5">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-9 h-9 bg-secondary border border-border rounded-xl flex items-center justify-center text-muted hover:text-primary hover:border-primary/50 transition">
                  <s.icon size={14} />
                </a>
              ))}
            </div>
            {/* Bottom links pindah ke sini */}
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {bottomLinks.map((l) => (
                <Link key={l.label} href={l.href}
                  className="text-xs text-muted hover:text-primary transition">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="font-bold text-sm mb-5">{col.title}</h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}
                      className="text-sm text-muted hover:text-primary transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-7">
          <span className="text-xs text-muted">
            © {new Date().getFullYear()} {siteName}. Seluruh hak cipta dilindungi.
          </span>
        </div>
      </div>
    </footer>
  );
}
