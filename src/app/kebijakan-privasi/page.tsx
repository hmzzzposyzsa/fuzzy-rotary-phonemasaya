export default function KebijakanPrivasiPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-outfit text-3xl font-black mb-2">Kebijakan Privasi</h1>
      <p className="text-muted mb-8">Terakhir diperbarui: 2 Juli 2026</p>
      <div className="space-y-6 text-sm text-muted leading-relaxed">
        {[
          { title: "1. Data yang Kami Kumpulkan", body: "Kami mengumpulkan informasi yang kamu berikan saat mendaftar (nama, email, nomor WhatsApp), data transaksi (produk yang dibeli, User ID game, jumlah pembayaran), dan data teknis (alamat IP, browser, perangkat) untuk keperluan keamanan dan rate limiting." },
          { title: "2. Penggunaan Data", body: "Data kamu digunakan untuk memproses transaksi, mengirim konfirmasi pembelian, memberikan layanan pelanggan, mencegah penipuan dan penyalahgunaan, serta meningkatkan layanan kami." },
          { title: "3. Keamanan Data", body: "Kami menggunakan enkripsi SSL/TLS untuk semua transmisi data. Password disimpan dalam bentuk terenkripsi (hash) menggunakan standar industri melalui Supabase Auth. Kami tidak pernah menyimpan data kartu kredit atau informasi pembayaran sensitif." },
          { title: "4. Berbagi Data", body: "Kami tidak menjual data pribadi kamu kepada pihak ketiga. Data hanya dibagikan kepada payment gateway untuk keperluan pemrosesan pembayaran, dan penyedia layanan teknis yang membantu operasional platform kami." },
          { title: "5. Cookie", body: "Kami menggunakan cookie untuk menjaga sesi login kamu dan meningkatkan pengalaman pengguna. Kamu dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur mungkin tidak berfungsi dengan baik." },
          { title: "6. Hak Kamu", body: "Kamu berhak mengakses, memperbaiki, atau menghapus data pribadi kamu. Untuk mengajukan permintaan, hubungi kami melalui halaman Info & Layanan." },
          { title: "7. Perubahan Kebijakan", body: "Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di website." },
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
