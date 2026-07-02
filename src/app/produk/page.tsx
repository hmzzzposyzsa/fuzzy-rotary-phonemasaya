import ProductListClient from "@/components/ProductListClient";
import { getProducts, getCategories } from "@/lib/api";

export const revalidate = 60;

export default async function ProdukPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let categories: string[] = [];

  try {
    [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
  } catch {
    // API eksternal belum aktif -> halaman tetap render, list kosong.
  }

  return (
    <ProductListClient initialProducts={products} initialCategories={categories} />
  );
}
