import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductById, getProductReviews } from "@/lib/api";
import type { Product, Review } from "@/types";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let product: Product | null = null;
  let reviews: Review[] = [];

  try {
    [product, reviews] = await Promise.all([
      getProductById(params.id),
      getProductReviews(params.id),
    ]);
  } catch {
    // Kalau API down/belum siap, tampilkan halaman 404 yang ramah
    // daripada error mentah.
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="text-muted mb-4">
          Produk tidak ditemukan atau API belum terhubung.
        </p>
        <Link href="/produk" className="text-primary font-semibold text-sm">
          ← Kembali ke Produk
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/produk"
        className="inline-flex items-center gap-2 text-sm text-muted font-medium mb-7 hover:text-foreground transition"
      >
        <ChevronLeft size={15} />
        Kembali ke Produk
      </Link>

      <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
        <div>
          <div className="sticky top-20">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary border border-border mb-4 relative">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div>
                <span className="font-outfit text-2xl font-black text-primary">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted line-through ml-2">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm my-3">
                <strong>{product.rating}</strong>
                <span className="text-muted">
                  ({product.reviewCount.toLocaleString("id-ID")} ulasan)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <span className="inline-block text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1 mb-3">
            {product.category}
          </span>
          <h1 className="font-outfit text-2xl sm:text-3xl font-black leading-tight mb-6">
            {product.name}
          </h1>

          <ProductDetailClient
            product={product}
            reviews={reviews}
          />
        </div>
      </div>
    </div>
  );
}
