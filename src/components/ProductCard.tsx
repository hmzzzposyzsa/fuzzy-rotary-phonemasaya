import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import { formatRupiah } from "@/lib/format";

const badgeColor: Record<string, string> = {
  "BEST SELLER": "bg-yellow-400 text-black",
  HOT: "bg-red-500 text-white",
  SALE: "bg-emerald-500 text-white",
  NEW: "bg-sky-500 text-white",
  POPULER: "bg-violet-500 text-white",
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produk/${product.id}`}
      className="group bg-card border border-border rounded-xl2 overflow-hidden text-left block transition-all hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(59,126,248,0.12)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[0.7rem] font-bold px-2.5 py-1 rounded-lg ${
              badgeColor[product.badge] || "bg-primary text-white"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <span className="block text-[0.7rem] text-muted font-semibold tracking-wider uppercase mb-1.5">
          {product.category}
        </span>
        <div className="font-bold text-sm leading-snug mb-2.5 line-clamp-2">
          {product.name}
        </div>
        <div className="flex items-center gap-1.5 text-xs mb-3">
          <Star size={11} className="fill-yellow-400 text-yellow-400" />
          <strong>{product.rating}</strong>
          <span className="text-muted">
            ({product.reviewCount.toLocaleString("id-ID")})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-primary text-sm">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[0.7rem] text-muted line-through ml-1.5">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-xs font-bold bg-primary/15 text-primary px-3.5 py-1.5 rounded-lg group-hover:bg-primary group-hover:text-white transition">
            Beli
          </span>
        </div>
      </div>
    </Link>
  );
}
