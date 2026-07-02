export default function SyaratKetentuanPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-outfit text-3xl font-black mb-2">Syarat &amp; Ketentuan</h1>
      <p className="text-muted mb-8">Terakhir diperbarui: 2 Juli 2026</p>
      <div className="space-y-6 text-sm text-muted leading-relaxed">
        {[
          { title: "1. Penerimaan Syarat", body: "Dengan mengakses dan menggunakan layanan Arduyy Shop, kamu menyetujui syarat dan ketentuan ini secara penuh. Jika kamu tidak menyetujui syarat ini, harap tidak menggunakan layanan kami." },
          { title: "2. Layanan", body: "Arduyy Shop menyediakan layanan top up game digital. Kami berhak mengubah, menghentikan, atau membatasi layanan kapan saja tanpa pemberitahuan sebelumnya." },
          { title: "3. Akun Pengguna", body: "Kamu bertanggung jawab atas keamanan akun kamu. Jangan bagikan password kepada siapapun. Arduyy Shop tidak bertanggung jawab atas kerugian akibat akses tidak sah ke akun kamu." },
          { title: "4. Pembayaran", body: "Semua harga yang tertera sudah termasuk pajak. Pembayaran dilakukan melalui QRIS. Setelah pembayaran berhasil, transaksi tidak dapat dibatalkan." },
          { title: "5. Top Up Game", body: "Pastikan User ID dan Server ID yang kamu masukkan sudah benar sebelum melakukan pembayaran. Kami tidak bertanggung jawab atas kesalahan input yang dilakukan pengguna." },
          { title: "6. Larangan", body: "Kamu dilarang menggunakan layanan kami untuk tujuan ilegal, mencoba meretas sistem kami, melakukan penipuan, atau melanggar hak kekayaan intelektual pihak manapun." },
          { title: "7. Perubahan Syarat", body: "Kami dapat memperbarui syarat ini sewaktu-waktu. Perubahan akan berlaku segera setelah dipublikasikan. Penggunaan layanan yang berkelanjutan berarti kamu menerima perubahan tersebut." },
          { title: "8. Hubungi Kami", body: "Jika kamu memiliki pertanyaan tentang syarat ini, silakan hubungi kami melalui halaman Info & Layanan." },
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
