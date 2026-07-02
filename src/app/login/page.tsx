"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Mail, Lock, User, Eye, EyeOff, Phone, KeyRound } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type Mode = "login" | "register";
type RegStep = "form" | "otp";

// Logo Google resmi dari CDN
const GOOGLE_LOGO = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // Register
  const [regStep, setRegStep] = useState<RegStep>("form");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPw, setRegPw] = useState("");
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  function switchMode(m: Mode) {
    setMode(m);
    setErrorMsg(null);
    setInfoMsg(null);
    setRegStep("form");
    setOtp("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPw,
      });
      if (error) { setErrorMsg(error.message); return; }
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp() {
    if (!regEmail || !regEmail.includes("@")) {
      setErrorMsg("Masukkan email yang valid terlebih dahulu");
      return;
    }
    setSendingOtp(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Gagal kirim OTP"); return; }
      setInfoMsg(`OTP dikirim ke ${regEmail}. Cek inbox / spam kamu.`);
      setRegStep("otp");
      // Cooldown 60 detik
      setOtpCooldown(60);
      const iv = setInterval(() => {
        setOtpCooldown((v) => {
          if (v <= 1) { clearInterval(iv); return 0; }
          return v - 1;
        });
      }, 1000);
    } catch { setErrorMsg("Gagal kirim OTP"); }
    finally { setSendingOtp(false); }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (!otp || otp.length !== 6) { setErrorMsg("Masukkan OTP 6 digit"); return; }
    setLoading(true);
    try {
      // Verifikasi OTP dulu
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, otp }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) { setErrorMsg(verifyData.error || "OTP salah"); return; }

      // Daftar ke Supabase
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPw,
        options: { data: { full_name: regName, phone: regPhone } },
      });
      if (error) { setErrorMsg(error.message); return; }
      setInfoMsg("Akun berhasil dibuat! Silakan login.");
      switchMode("login");
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/` },
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal login dengan Google");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card border border-border rounded-3xl p-8">
        <div className="w-14 h-14 bg-primary/15 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={22} className="text-primary" />
        </div>
        <h1 className="font-outfit text-2xl font-black text-center mb-1">
          {mode === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}
        </h1>
        <p className="text-sm text-muted text-center mb-7">
          {mode === "login" ? "Login ke akun Arduyy Shop kamu" : "Bergabung dengan ribuan gamer"}
        </p>

        <div className="flex gap-1 bg-secondary border border-border rounded-2xl p-1 mb-7">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl text-center transition-all ${
                mode === m ? "bg-card text-foreground shadow" : "text-muted"
              }`}
            >
              {m === "login" ? "Login" : "Daftar"}
            </button>
          ))}
        </div>

        {errorMsg && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5 mb-5">
            {errorMsg}
          </p>
        )}
        {infoMsg && (
          <p className="text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-2.5 mb-5">
            {infoMsg}
          </p>
        )}

        {/* ── LOGIN FORM ── */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:border-primary/50 transition" />
              </div>
            </div>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Password</label>
                <button type="button" className="text-xs text-primary font-medium hover:underline">Lupa password?</button>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type={showPw ? "text" : "password"} required value={loginPw} onChange={(e) => setLoginPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-11 text-sm outline-none focus:border-primary/50 transition" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-2xl font-black text-sm shadow-[0_8px_24px_rgba(59,126,248,0.3)] hover:bg-[#2d6ef0] hover:-translate-y-0.5 transition-all disabled:opacity-60">
              {loading ? "Memproses..." : "Login ke Akun"}
            </button>
          </form>
        )}

        {/* ── REGISTER FORM ── */}
        {mode === "register" && regStep === "form" && (
          <div>
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2">Nama Lengkap</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Nama lengkap kamu"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:border-primary/50 transition" />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="email@contoh.com"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:border-primary/50 transition" />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2">No. WhatsApp</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="08xxxxxxxxxx"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:border-primary/50 transition" />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type={showPw ? "text" : "password"} required minLength={6} value={regPw} onChange={(e) => setRegPw(e.target.value)} placeholder="Minimal 6 karakter"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-11 text-sm outline-none focus:border-primary/50 transition" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Dengan mendaftar, kamu menyetujui <a href="/syarat-ketentuan" className="text-primary hover:underline">Syarat & Ketentuan</a> dan <a href="/kebijakan-privasi" className="text-primary hover:underline">Kebijakan Privasi</a> kami.
            </p>
            <button onClick={handleSendOtp} disabled={sendingOtp || !regEmail || !regPw || regPw.length < 6}
              className="w-full bg-primary text-white py-3.5 rounded-2xl font-black text-sm shadow-[0_8px_24px_rgba(59,126,248,0.3)] hover:bg-[#2d6ef0] transition-all disabled:opacity-60">
              {sendingOtp ? "Mengirim OTP..." : "Kirim Kode OTP"}
            </button>
          </div>
        )}

        {/* ── OTP STEP ── */}
        {mode === "register" && regStep === "otp" && (
          <form onSubmit={handleRegister}>
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <KeyRound size={20} className="text-primary" />
              </div>
              <p className="text-sm text-muted">OTP dikirim ke</p>
              <p className="font-semibold text-sm">{regEmail}</p>
            </div>
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2 text-center">Masukkan Kode OTP</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full bg-input border border-border rounded-2xl py-4 text-center text-2xl font-mono font-black tracking-widest outline-none focus:border-primary/50 transition"
              />
            </div>
            <button type="submit" disabled={loading || otp.length !== 6}
              className="w-full bg-primary text-white py-3.5 rounded-2xl font-black text-sm shadow-[0_8px_24px_rgba(59,126,248,0.3)] hover:bg-[#2d6ef0] transition-all disabled:opacity-60 mb-3">
              {loading ? "Memverifikasi..." : "Verifikasi & Daftar"}
            </button>
            <button type="button" onClick={handleSendOtp} disabled={otpCooldown > 0 || sendingOtp}
              className="w-full py-2.5 rounded-2xl text-sm font-semibold text-muted hover:text-foreground transition disabled:opacity-50">
              {otpCooldown > 0 ? `Kirim ulang dalam ${otpCooldown}s` : "Kirim ulang OTP"}
            </button>
            <button type="button" onClick={() => setRegStep("form")} className="w-full py-2 text-xs text-muted hover:text-foreground transition">
              ← Ubah email
            </button>
          </form>
        )}

        <div className="relative my-5">
          <div className="border-t border-border" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted">
            atau
          </span>
        </div>

        <button onClick={handleGoogleLogin}
          className="w-full bg-secondary border border-border text-secondary-foreground py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 hover:border-primary/40 transition">
          <img src={GOOGLE_LOGO} alt="Google" className="w-4 h-4" />
          Lanjutkan dengan Google
        </button>
      </div>
    </div>
  );
}
