export default function KebijakanRefundPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-outfit text-3xl font-black mb-2">Kebijakan Refund</h1>
      <p className="text-muted mb-8">Terakhir diperbarui: 2 Juli 2026</p>
      <div className="space-y-4 text-sm text-muted leading-relaxed">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
          <h2 className="font-bold text-emerald-400 mb-2">✅ Kondisi Refund Diterima</h2>
          <ul className="space-y-2">
            {["Top up gagal diproses lebih dari 30 menit setelah pembayaran berhasil","Server game mengalami gangguan sehingga item tidak dapat dikirimkan","Terjadi double charge (pembayaran ganda) untuk satu transaksi","Transaksi terbukti error dari sistem kami"].map((i) => (
              <li key={i} className="flex gap-2"><span className="text-emerald-400 shrink-0">•</span>{i}</li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
          <h2 className="font-bold text-red-400 mb-2">❌ Kondisi Refund Tidak Diterima</h2>
          <ul className="space-y-2">
            {["User ID atau Server ID yang dimasukkan salah","Pembelian yang dilakukan sudah berhasil diproses","Perubahan keputusan setelah transaksi berhasil","Akun game yang diblokir oleh developer game"].map((i) => (
              <li key={i} className="flex gap-2"><span className="text-red-400 shrink-0">•</span>{i}</li>
            ))}
          </ul>
        </div>
        {[
          { title: "Proses Refund", body: "Jika refund disetujui, dana akan dikembalikan dalam 1–3 hari kerja melalui metode pembayaran yang sama. Untuk mengajukan refund, hubungi CS kami melalui WhatsApp atau Telegram dengan menyertakan nomor invoice." },
          { title: "Bukti yang Diperlukan", body: "Screenshot bukti pembayaran, nomor invoice (format INV-XXXXXXXX-XXXXXX), dan penjelasan singkat masalah yang dialami." },
          { title: "Batas Waktu Pengajuan", body: "Pengajuan refund harus dilakukan maksimal 24 jam setelah transaksi dilakukan. Pengajuan yang melebihi batas waktu ini tidak akan diproses." },
        ].map((s) => (
          <div key={s.title} className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-bold text-foreground mb-2">{s.title}</h2>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
