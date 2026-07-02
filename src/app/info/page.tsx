import InfoAccordionClient from "@/components/InfoAccordionClient";
import { getInfoCategories } from "@/lib/api";

export const revalidate = 300;

export default async function InfoPage() {
  let categories: Awaited<ReturnType<typeof getInfoCategories>> = [];
  try {
    categories = await getInfoCategories();
  } catch {
    // API belum siap -> InfoAccordionClient akan tampilkan state kosong.
  }

  return (
    <div>
      <div className="mb-9">
        <h1 className="font-outfit text-3xl font-black mb-1.5">Info &amp; Layanan</h1>
        <p className="text-muted">
          Klik setiap kategori untuk melihat link dan informasi yang tersedia
        </p>
      </div>
      <InfoAccordionClient categories={categories} />
    </div>
  );
}
