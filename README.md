# Arduyy Shop — Next.js (App Router)

Frontend e-commerce top up game. Project ini **ringan** karena semua
data (produk, info/link, payment methods, dsb) **tidak disimpan di sini** —
diambil lewat `fetch()` dari API eksternal (server kamu sendiri, terpisah).
Login/register pakai **Supabase Auth**.

## 1. Jalankan secara lokal

```bash
npm install
cp .env.example .env.local
# isi .env.local dengan URL API kamu + kredensial Supabase
npm run dev
```

## 2. Deploy ke Vercel

1. Push folder ini ke repo GitHub.
2. Import repo di [vercel.com/new](https://vercel.com/new).
3. Saat setup, tambahkan Environment Variables (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_API_BASE_URL` — base URL server API data kamu
   - `NEXT_PUBLIC_SUPABASE_URL` — dari project Supabase kamu
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — dari project Supabase kamu
4. Klik Deploy. Selesai — Vercel otomatis detect Next.js.

Catatan: framework "auto-detect" Vercel akan langsung mengenali ini sebagai
Next.js App Router, tidak perlu konfigurasi tambahan.

## 3. Setup Supabase Auth

1. Buat project baru di [supabase.com](https://supabase.com).
2. Di **Authentication → Providers**, aktifkan Email (sudah default) dan
   Google (opsional, untuk tombol "Lanjutkan dengan Google").
3. Di **Authentication → URL Configuration**, set Site URL ke domain
   Vercel kamu (mis. `https://arduyy-shop.vercel.app`).
4. Salin `Project URL` dan `anon public key` ke environment variable di atas.

Tidak perlu bikin tabel database apapun di Supabase — Supabase di sini
hanya dipakai untuk Auth. Semua data produk/info ada di API eksternal kamu.

## 4. Troubleshooting

**Error `500: MIDDLEWARE_INVOCATION_FAILED` setelah deploy ke Vercel**
Ini terjadi kalau `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
belum diisi di Environment Variables Vercel. Project ini sudah dibuat
"fail-safe" (middleware tidak akan crash walau env kosong — fitur login saja
yang nonaktif sementara), tapi tetap disarankan isi env-nya supaya Login/Register
berfungsi. Setelah isi env di Vercel (Project Settings → Environment Variables),
klik **Redeploy** — env var baru tidak otomatis ter-apply ke deployment lama.

## 5. Kontrak API eksternal (WAJIB dibuat di server kamu)

Base URL API ditentukan oleh `NEXT_PUBLIC_API_BASE_URL`. Semua endpoint
di bawah ini diasumsikan ada di root tersebut, contoh:
`https://api.domainkamu.com/products`.

CORS: pastikan API kamu mengizinkan request dari domain Vercel frontend ini
(`Access-Control-Allow-Origin`).

### GET `/products`
Query params opsional: `?category=Mobile+Legends&search=diamond`
Response: `Product[]`
```json
[
  {
    "id": "1",
    "name": "Mobile Legends 86 Diamonds",
    "category": "Mobile Legends",
    "price": 20000,
    "originalPrice": 25000,
    "image": "https://...jpg",
    "rating": 4.9,
    "reviewCount": 1240,
    "badge": "BEST SELLER",
    "description": "...",
    "features": ["Proses instan", "Aman & terpercaya"]
  }
]
```

### GET `/products?sort=bestseller&limit=3`
Sama seperti di atas, dipakai untuk section "Best Seller" di Dashboard.

### GET `/products/:id`
Response: satu object `Product` (lihat skema di atas).

### GET `/products/:id/reviews`
Response: `Review[]`
```json
[
  { "id": "r1", "productId": "1", "name": "Rizky", "rating": 5, "comment": "Mantap", "date": "25 Jun 2026" }
]
```

### GET `/categories`
Response: `string[]` — daftar nama kategori, contoh:
```json
["Mobile Legends", "Free Fire", "PUBG Mobile", "Valorant"]
```

### GET `/info-links`
Untuk halaman **Info** (accordion dropdown). Response: `InfoCategory[]`
```json
[
  {
    "id": "panduan",
    "title": "Panduan Top Up",
    "subtitle": "Tutorial, video, dan cara top up",
    "links": [
      { "id": "l1", "label": "Tutorial Video Top Up", "url": "https://youtube.com/...", "badge": "YouTube" },
      { "id": "l2", "label": "Cara Cek Status Transaksi", "url": "https://..." }
    ]
  }
]
```

### GET `/payment-methods`
Response: `PaymentMethod[]`
```json
[
  { "id": "dana", "label": "DANA", "color": "#0066CC" },
  { "id": "ovo", "label": "OVO", "color": "#4C3494" }
]
```

### GET `/site-config`
Dipakai untuk nama toko & logo di Header (di-fetch sekali di root layout).
```json
{ "siteName": "Arduyy Shop", "logoUrl": "https://...png" }
```
Kalau `logoUrl` adalah `null`, frontend otomatis pakai icon bawaan.

### POST `/orders`
Dipanggil saat user klik "Bayar Sekarang" di halaman detail produk.
Body:
```json
{
  "productId": "1",
  "userId": "uuid-dari-supabase-jika-login (opsional)",
  "gameUserId": "123456789",
  "serverId": "1234",
  "email": "user@email.com",
  "paymentMethod": "dana"
}
```
Response yang diharapkan:
```json
{ "orderId": "ord_123", "status": "pending", "paymentUrl": "https://..." }
```

## 6. Struktur folder

```
src/
  app/
    page.tsx            -> Dashboard
    produk/page.tsx      -> List produk + search/filter
    produk/[id]/page.tsx -> Detail produk + checkout
    info/page.tsx         -> Info & link (accordion)
    login/page.tsx         -> Login/Register (Supabase Auth)
    layout.tsx               -> Root layout, fetch site-config
  components/             -> Semua UI component
  lib/
    api.ts                  -> SEMUA fetch ke API eksternal ada di sini
    supabase-browser.ts      -> Supabase client (client component)
    supabase-server.ts       -> Supabase client (server component)
    format.ts                -> Helper format Rupiah
  types/index.ts             -> Semua tipe data (Product, InfoLink, dst)
```

Kalau API eksternal kamu punya skema field yang beda, cukup ubah
`src/types/index.ts` dan `src/lib/api.ts` — tidak perlu sentuh komponen UI.
