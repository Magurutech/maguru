import React from 'react'
import Link from 'next/link'
import { SkeuoCard } from '@/components/skeuo-card'

export default function DesignSystemIndex() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeuoCard
          variant="ancient"
          size="large"
          titleText="Filosofi Atelier Zero"
          descriptionText="Intelligent Simplicity + Empowering Mastery"
          className="shadow-md"
        >
          <div className="text-body-md text-text-secondary space-y-4">
            <p>
              Maguru dirancang untuk menghadirkan antarmuka AI-Native yang cerdas namun tetap sederhana dan hangat. 
              Gaya desain Atelier Zero menghilangkan elemen digital datar yang membosankan (*flat design*) 
              dan menggantinya dengan material taktil fisik yang kaya tekstur kertas, bayangan, dan kedalaman 3D.
            </p>
            <p>
              Dengan memadukan bevel fisis terarah (cahaya 45° kiri-atas) dan pergerakan hover magnetis, 
              kita memberikan umpan balik visual instan yang memberdayakan pengguna dalam perjalanan belajar mereka.
            </p>
          </div>
        </SkeuoCard>
      </section>

      {/* Do's & Don'ts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeuoCard
          variant="paper"
          titleText="Do's (Anjuran Desain)"
          className="border-l-4 border-l-success"
        >
          <ul className="text-body-medium text-text-secondary list-disc pl-5 space-y-2">
            <li>Gunakan *whitespace* yang longgar untuk mengurangi beban kognitif saat belajar.</li>
            <li>Pastikan asisten AI Co-Teacher selalu mudah diakses namun tidak menghalangi konten utama.</li>
            <li>Gunakan mikro-interaksi fisis (seperti `.btn-interactive`) untuk setiap elemen interaktif.</li>
            <li>Gunakan font `Cinzel` untuk penomoran Romawi pada status pencapaian kompetensi (*mastery*).</li>
          </ul>
        </SkeuoCard>

        <SkeuoCard
          variant="paper"
          titleText="Don'ts (Hindari Desain)"
          className="border-l-4 border-l-error"
        >
          <ul className="text-body-medium text-text-secondary list-disc pl-5 space-y-2">
            <li>Jangan gunakan warna datar yang terlalu tajam atau mengganggu fokus belajar.</li>
            <li>Jangan gunakan istilah teknis yang rumit tanpa penjelasan/helper text untuk pemula.</li>
            <li>Jangan mencampuradukkan gaya embossed 3D dan flat secara acak tanpa arah cahaya yang konsisten.</li>
            <li>Jangan gunakan emoji sebagai ikon utama; selalu gunakan SVG (seperti Lucide).</li>
          </ul>
        </SkeuoCard>
      </section>

      {/* Quick Navigation Cards */}
      <section className="space-y-4">
        <h2 className="text-h2 font-manrope font-semibold text-text-primary mb-6">Navigasi Cepat Panduan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/design-system/typography" className="block">
            <SkeuoCard
              variant="paper"
              interactive={true}
              titleText="Typography"
              descriptionText="Panduan font, letter-spacing, dan hierarchy."
              className="h-full hover:scale-105"
            >
              <div className="text-body-md text-text-muted mt-2">
                Menampilkan skala visual font Poppins, Playfair Display, dan Fira Code.
              </div>
            </SkeuoCard>
          </Link>

          <Link href="/design-system/colors" className="block">
            <SkeuoCard
              variant="paper"
              interactive={true}
              titleText="Colors"
              descriptionText="Daftar palet warna Atelier Zero."
              className="h-full hover:scale-105"
            >
              <div className="text-body-md text-text-muted mt-2">
                Swatches interaktif Light Mode (Warm Parchment) & Dark Mode (Warm Charcoal).
              </div>
            </SkeuoCard>
          </Link>

          <Link href="/design-system/ui-elements" className="block">
            <SkeuoCard
              variant="paper"
              interactive={true}
              titleText="UI Elements"
              descriptionText="Visualisasi pustaka komponen antarmuka."
              className="h-full hover:scale-105"
            >
              <div className="text-body-md text-text-muted mt-2">
                Showcase visual tombol, status badges, input fields, chat bubbles, dan course card.
              </div>
            </SkeuoCard>
          </Link>
        </div>
      </section>
    </div>
  )
}
