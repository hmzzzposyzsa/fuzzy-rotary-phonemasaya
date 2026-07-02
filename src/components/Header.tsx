"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package, Info, LogIn, LogOut, Menu, X, ShoppingBag } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { SiteConfig } from "@/types";

const navItems = [
  { href: "/", label: "Dashboard", icon: ShoppingBag },
  { href: "/produk", label: "Produk", icon: Package },
  { href: "/info", label: "Info", icon: Info },
];

export default function Header({ siteConfig }: { siteConfig: SiteConfig }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getUser().then(({ data }) => {
        setUserEmail(data.user?.email ?? null);
      });
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUserEmail(session?.user?.email ?? null);
      });
      return () => listener.subscription.unsubscribe();
    } catch {
      // Supabase belum dikonfigurasi (env var kosong) -> anggap saja
      // belum ada user yang login, jangan crash UI.
      setUserEmail(null);
    }
  }, []);

  async function handleLogout() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      // Supabase belum dikonfigurasi -> tidak ada yang perlu di-logout
    }
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/85 backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_8px_20px_rgba(59,126,248,0.4)] overflow-hidden shrink-0">
            {siteConfig.logoUrl ? (
              <Image
                src={siteConfig.logoUrl}
                alt={siteConfig.siteName}
                width={36}
                height={36}
                className="w-full h-full object-cover rounded-xl"
                unoptimized
              />
            ) : (
              <ShoppingBag size={17} className="text-white" />
            )}
          </div>
          <span className="font-outfit text-xl font-black tracking-tight">
            {siteConfig.siteName.split(" ")[0]}
            <span className="text-primary"> {siteConfig.siteName.split(" ").slice(1).join(" ")}</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive(item.href)
                  ? "bg-primary text-white shadow-[0_6px_18px_rgba(59,126,248,0.35)]"
                  : "text-muted hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
          {userEmail ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-muted hover:text-foreground hover:bg-secondary transition-all"
            >
              <LogOut size={15} />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive("/login")
                  ? "bg-primary text-white shadow-[0_6px_18px_rgba(59,126,248,0.35)]"
                  : "text-muted hover:text-foreground hover:bg-secondary"
              }`}
            >
              <LogIn size={15} />
              Login
            </Link>
          )}
        </nav>

        <button
          className="md:hidden p-2 rounded-xl hover:bg-secondary transition"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pb-4 pt-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold mb-1 transition-all ${
                isActive(item.href)
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
          {userEmail ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-muted hover:text-foreground hover:bg-secondary transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive("/login")
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground hover:bg-secondary"
              }`}
            >
              <LogIn size={16} />
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
