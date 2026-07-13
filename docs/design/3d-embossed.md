# Bicket Design System: 3D Embossed Gradient Color Palette

Panduan ini mendokumentasikan aturan penggunaan dan prinsip fisika cahaya untuk **3D Embossed Gradient Color Palette** di Bicket. Sesuai dengan prinsip *Artisan Skeuomorphism*, elemen antarmuka di Bicket tidak menggunakan warna datar (*flat solid*), melainkan disajikan sebagai permukaan objek 3D fisis dengan gradasi dan bayangan terintegrasi.

---

## 1. Golden Rule: Arah Cahaya 45° Kiri-Atas

Semua permukaan embossed fisis harus menirukan arah datang cahaya dari **Kiri-Atas (sudut 45 derajat)**. Oleh karena itu:
- **Top & Left Border (Bevel Terang):** Berfungsi menangkap sorotan cahaya (*specular highlight*), menggunakan warna putih/terang semi-transparan.
- **Bottom & Right Border (Bevel Gelap/Shade):** Berfungsi menirukan ketebalan fisik benda, menggunakan warna hitam/gelap semi-transparan.
- **Gradien Latar Belakang:** Warna gradasi mengalir diagonal dari Kiri-Atas (terang) ke Kanan-Bawah (gelap).

---

## 2. Kelas Utilitas Warna 3D (`@utility`)

Terdapat 7 utilitas warna embossed utama yang dideklarasikan di berkas [global.css](file:///D:/2-Project/bicket/style/global.css):

### A. Sage Green (`sage-skeuo`)
Permukaan hijau bernuansa alam Makassar, kokoh dan berbobot.
- **Latar Belakang:** Sage Green (`#566B4D`) ke Forest Green (`#3E5237`).
- **Garis Tepi (Border):** Bevel terang atas-kiri (`rgba(255,255,255,0.4)`), bevel tebal bawah-kanan (`rgba(0,0,0,0.35)`).
- **Teks Default:** Ivory (`#FAF4EC`) dengan efek bayangan teks tenggelam.

### B. Artisan Forest (`forest-skeuo`)
Permukaan hijau hutan gelap kontras tinggi untuk aksi pendukung sekunder.
- **Latar Belakang:** Forest Green (`#3E5237`) ke Deep Pine (`#222E1F`).
- **Garis Tepi (Border):** Bevel terang atas-kiri (`rgba(255,255,255,0.3)`), bevel tebal bawah-kanan (`rgba(0,0,0,0.5)`).
- **Teks Default:** Ivory (`#FAF4EC`) dengan bayangan teks terukir tebal.
- **Rekomendasi Penggunaan:** Aksi sekunder, tombol pendukung kontras tinggi, teks terukir fisis, dan ornamen interaktif lembut.

### C. Romantic Peach (`peach-skeuo`)
Permukaan romantis hangat dengan kontras tinggi, berfungsi sebagai penarik perhatian utama.
- **Latar Belakang:** Soft Peach (`#EBC3A8`) ke Dusty Rose (`#D79C9A`).
- **Garis Tepi (Border):** Bevel terang atas-kiri (`rgba(255,255,255,0.65)`), bevel bawah-kanan hangat (`rgba(184,154,87,0.4)`).
- **Teks Default:** Forest Green (`#3E5237`).
- **Rekomendasi Penggunaan:** Aksi utama kontras tinggi, tombol primer utama (CTA) seperti pembelian/pesanan, dan highlight penarik perhatian penting.

### D. Golden Hour (`gold-skeuo`)
Aksen mewah premium untuk badge kreator artisan Makassar.
- **Latar Belakang:** Soft Peach (`#EBC3A8`) ke Muted Gold (`#B89A57`).
- **Garis Tepi (Border):** Bevel terang atas-kiri (`rgba(255,255,255,0.75)`), bevel bawah-kanan kuningan (`rgba(120,90,40,0.45)`).
- **Teks Default:** Forest Green (`#3E5237`).

### E. Artisan Olive (`olive-skeuo`)
Warna zaitun hangat menyerupai lempengan tanah liat atau logam perunggu antik.
- **Latar Belakang:** Olive (`#78865C`) ke Shadow Olive (`#566141`).
- **Garis Tepi (Border):** Bevel terang atas-kiri (`rgba(255,255,255,0.5)`), bevel bawah-kanan perunggu (`rgba(0,0,0,0.3)`).
- **Teks Default:** Ivory (`#FAF4EC`) dengan bayangan teks terukir lembut.

### F. Vintage Paper (`paper-skeuo`)
Permukaan taktil bertekstur serat kertas katun buatan tangan (*handmade*).
- **Latar Belakang:** Ivory (`#FAF4EC`) ke Warm Beige (`#E9D7BE`).
- **Garis Tepi (Border):** Bevel terang atas-kiri (`rgba(255,255,255,0.9)`), bevel bawah-kanan halus (`rgba(184,154,87,0.25)`).
- **Teks Default:** Forest Green (`#3E5237`).

### G. Warm Sand (`sand-skeuo`)
Permukaan krem pasir hangat menyerupai kayu halus atau kertas kerajinan (kraft) tebal.
- **Latar Belakang:** Warm Beige (`#E9D7BE`) ke Sand (`#C5B296`).
- **Garis Tepi (Border):** Bevel terang atas-kiri (`rgba(255,255,255,0.85)`), bevel bawah-kanan halus (`rgba(184,154,87,0.35)`).
- **Teks Default:** Forest Green (`#3E5237`).

---

## 3. Contoh Penggunaan dalam Kode (React/Tailwind)

Gunakan utilitas ini secara langsung pada elemen kontainer, tombol, atau badge:

### 1. Tombol Aksi Timbul (Embossed Button)
```tsx
import { cn } from "@/lib/utils";

export function PurchaseButton() {
  return (
    <button className={cn(
      "px-6 py-3 rounded-xl font-semibold btn-interactive",
      "peach-skeuo"
    )}>
      Beli Bucket Sekarang
    </button>
  );
}
```

### 2. Badge Status Premium (Premium Tag)
```tsx
export function CreatorBadge() {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-bold gold-skeuo">
      Artisan Terverifikasi
    </span>
  );
}
```

### 3. Kartu Ikon Promo (Interactive Promo Icon Card)
```tsx
import { Gift } from "lucide-react";

export function PromoIconCard() {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] peach-skeuo transition-transform duration-300 hover:scale-105">
      <Gift className="h-5 w-5" />
    </div>
  );
}
```

---

## 4. Panduan Mikro-Interaksi

Saat menggunakan utilitas embossed 3D, gabungkan dengan mikro-interaksi berikut agar terasa responsif secara fisis:
- **Hover State:** Gunakan `hover:scale-[1.02] hover:-translate-y-0.5` untuk menirukan efek magnetis/terangkat dari permukaan layar.
- **Active State (Klik):** Gunakan `active:scale-[0.98] active:translate-y-[1px]` untuk menirukan penekanan fisik ke dalam.
- **Penyederhanaan:** Untuk kemudahan, Anda dapat menggabungkan utilitas warna ini dengan kelas pembantu `btn-interactive`.
