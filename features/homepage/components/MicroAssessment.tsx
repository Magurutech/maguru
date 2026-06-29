"use client";

import { useState } from "react";

export function MicroAssessment() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = [
    {
      key: "A",
      text: "Urutkan array, ambil elemen terakhir — O(n log n)",
    },
    {
      key: "B",
      text: "Linear scan sekali lewat, lacak nilai terbesar — O(n)",
    },
    {
      key: "C",
      text: "Gunakan nested loop, bandingkan semua pasangan — O(n²)",
    },
    {
      key: "D",
      text: "Hanya bisa diketahui setelah mencoba semua metode",
    },
  ];

  const newLocal = "flex flex-col gap-2.5 text-left mb-7";
  return (
    <div className="max-w-170 mx-auto glass-panel border border-glass-border rounded-[18px] p-8 sm:p-12 text-center relative overflow-hidden">
      <span className="font-mono text-[11px] tracking-[0.14em] text-text-faint mb-4 uppercase block">
        Pertanyaan Asesmen · I of III
      </span>
      
      <h3 className="font-sans text-[19px] font-bold leading-relaxed text-text-primary mb-8 max-w-xl mx-auto">
        Kamu punya array{" "}
        <code className="font-mono bg-bg-surface-accent/70 dark:bg-bg-surface-accent px-1.5 py-0.5 rounded text-accent-coral text-sm sm:text-base">
          [3, 1, 4, 1, 5, 9, 2]
        </code>
        .<br />
        Algoritma mana yang paling efisien untuk mencari nilai maksimum?
      </h3>
 
      <div className={newLocal}>
        {options.map((opt) => {
          const isSelected = selectedOption === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setSelectedOption(opt.key)}
              className={`w-full text-left p-[14px_18px] border-[1.5px] rounded-[10px] font-sans text-sm font-medium cursor-pointer transition-all duration-180 flex items-center gap-3.5 min-h-12.5 ${
                isSelected
                  ? "bg-accent-coral/7 border-accent-coral text-text-primary"
                  : "bg-bg-surface border-glass-border text-text-secondary hover:bg-bg-bone hover:border-accent-coral hover:text-text-primary"
              }`}
            >
              <span className={`font-serif italic text-[13px] font-bold min-w-5 transition-colors duration-180 ${
                isSelected ? "text-accent-coral" : "text-text-faint"
              }`}>
                {opt.key}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>
 
      {selectedOption && (
        <div className="pt-5.5 border-t border-glass-border flex flex-col items-center gap-3 animate-[fadeUp_0.4s_ease_both]">
          <p className="font-sans text-sm text-text-muted max-w-[36ch] leading-relaxed">
            Jawabanmu tersimpan. Lanjutkan asesmen penuh untuk mendapatkan peta kompetensimu.
          </p>
          <a
            href="#asesmen-lengkap"
            className="inline-flex items-center gap-3 p-[14px_22px] rounded-full bg-accent-coral text-white font-sans text-sm font-semibold tracking-[-0.005em] shadow-sm hover:-translate-y-px hover:bg-[#e25e4a] transition-all duration-180"
          >
            Mulai Asesmen Kompetensi Lengkap — Gratis
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
