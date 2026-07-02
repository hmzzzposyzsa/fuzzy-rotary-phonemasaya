// Tipe-tipe data yang DIHARAPKAN datang dari API eksternal kamu.
// Sesuaikan field di sini jika struktur API asli kamu berbeda.

export interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;          // dalam Rupiah, angka murni (bukan string "Rp ...")
  originalPrice?: number | null;
  image: string;          // URL gambar
  rating: number;
  reviewCount: number;
  badge?: string | null;  // "BEST SELLER" | "HOT" | "SALE" | "NEW" | "POPULER" | null
  description: string;
  features: string[];
}

export interface Review {
  id: string | number;
  productId: string | number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface InfoLink {
  id: string | number;
  label: string;
  url: string;
  badge?: string | null;
  icon?: string; // optional: nama icon (lucide) atau URL icon kustom
}

export interface InfoCategory {
  id: string | number;
  title: string;
  subtitle?: string;
  icon?: string;
  links: InfoLink[];
}

export interface PaymentMethod {
  id: string;
  label: string;
  color?: string;
}

export interface SiteConfig {
  siteName: string;
  logoUrl?: string | null; // jika null/kosong, frontend pakai logo bawaan
  tagline?: string;
}

export interface AppUser {
  id: string;
  email: string;
  name?: string;
}
