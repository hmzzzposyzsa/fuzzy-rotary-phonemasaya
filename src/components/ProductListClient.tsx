"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, PackageX } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories } from "@/lib/api";
import type { Product } from "@/types";

export default function ProductListClient({
  initialProducts,
  initialCategories,
}: {
  initialProducts: Product[];
  initialCategories: string[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<string[]>(["Semua", ...initialCategories]);
  const [activeCat, setActiveCat] = useState("Semua");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Setiap kali kategori/pencarian berubah, panggil ulang API eksternal
  // (server lain) supaya filtering dilakukan oleh API, bukan di client.
  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getProducts({ category: activeCat, search });
        setProducts(data);
      } catch {
        // API belum tersedia -> biarkan list kosong, ditangani di render.
      } finally {
        setLoading(false);
      }
    }, 300); // debounce ringan untuk search

    return () => clearTimeout(timeout);
  }, [activeCat, search]);

  const isEmpty = !loading && products.length === 0;

  return (
    <div>
      <h1 className="font-outfit text-3xl font-black mb-1.5">Semua Produk</h1>
      <p className="text-muted mb-7">
        Temukan game favorit kamu dan top up dengan mudah
      </p>

      <div className="relative max-w-md mb-4">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk atau game..."
          className="w-full bg-card border border-border rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/50 transition"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-7">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeCat === cat
                ? "bg-primary text-white border-primary shadow-[0_4px_14px_rgba(59,126,248,0.3)]"
                : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isEmpty ? (
        <div className="text-center py-20 text-muted">
          <PackageX size={44} className="mx-auto mb-4 opacity-30" />
          <p className="font-semibold">Produk tidak ditemukan</p>
          <p className="text-sm mt-1">Coba kata kunci atau kategori lain</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
