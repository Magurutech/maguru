
Berikut adalah ringkasan terstruktur dari revisi-revisi yang saya usulkan sebelumnya, khusus untuk menyesuaikan overview proyek (dokumen NP1-P2) agar scope-nya menjadi sempit dan fokus murni pada pengembangan serta evaluasi model Automatic Question Generation (AQG). Revisi ini menghilangkan semua elemen integrasi platform Maguru yang berada di luar cakupan, sehingga artikel dapat lebih sesuai sebagai makalah ilmiah atau laporan teknis independen tentang model AQG.

Ringkasan Revisi Utama (Fokus pada Scope Baru)
Tujuan akhir dokumen: Hanya sampai pada pengembangan model seq2seq untuk AQG (termasuk question & distractor generation) + studi komparatif performa model-model Indonesia (IndoBART + LoRA sebagai baseline utama, IndoT5, IndoJavE-RoBERTa, IndoNLG) melalui metrik otomatis dan human evaluation. Tidak membahas integrasi, dampak platform, atau metrik downstream seperti pass rate siswa.
Bagian yang dihapus sepenuhnya:
Semua referensi ke "Maguru" sebagai platform spesifik (ganti dengan "platform pembelajaran coding adaptif berbahasa Indonesia" jika perlu konteks umum).
Sub-bagian 5.5 Integrasi dengan Platform Maguru (LangGraph, Adaptive Learning Agent, RAG retriever, LCEL chain, Quiz Master Agent, Streamlit).
Sub-bagian 6.2 Dampak pada Pembelajaran Adaptif (quiz pass rate, hint reduction, retention rate).
Sub-bagian 6.3 Efisiensi Pembuatan Konten (waktu pembuatan soal manual vs otomatis, skalabilitas platform).
Klaim kontribusi bisnis/jangka panjang yang terkait Maguru (misalnya, mengurangi perekrutan content writer).
Bagian yang direduksi/disesuaikan:
Pendahuluan/Penjelasan Awal: Hilangkan kalimat tentang "dirancang khusus untuk diintegrasikan ke platform multi-agent dan RAG" serta "memperkuat fitur adaptive learning di Maguru". Fokus pada tujuan teknis: menghasilkan soal MCQ dan Code Completion berkualitas dengan distraktor pedagogis dalam bahasa Indonesia.
Permasalahan: Hilangkan referensi berulang ke Maguru; pertahankan masalah umum (kurang variasi soal, beban manual, kurang adaptivitas assessment di platform coding berbahasa Indonesia). Tambahkan gap akademis: minimnya AQG di domain pemrograman berbahasa Indonesia.
Hasil yang Diharapkan: Hanya pertahankan 6.1 Kualitas Soal yang Dihasilkan (BERTScore >0.82, human score >4.2/5, plausibility distraktor >75%). Hilangkan klaim dampak siswa/platform.
Penyesuaian Tambahan untuk Studi Komparatif
Tambahkan sub-bagian baru di Metodologi atau Eksperimen: Studi Komparatif Model
Model yang dibandingkan:
IndoBART + LoRA (baseline utama, karena sudah multilingual dan cocok seq2seq).
IndoT5 (variasi T5 khusus Indonesia, seperti LazarusNLP/IndoT5 atau Wikidepia/IndoT5-base).
IndoJavE-RoBERTa (jika relevan untuk code-mixed; model ini lebih ke RoBERTa untuk Jawa-Indonesia-Inggris, mungkin perlu adaptasi seq2seq atau ganti jika tidak cocok langsung).
IndoNLG (merujuk benchmark IndoNLG, tapi model dasar seperti IndoBART/IndoGPT; gunakan varian seq2seq jika tersedia).
Evaluasi: Tambahkan tabel perbandingan metrik (BLEU-4, ROUGE-L, BERTScore, METEOR) antar model di atas, plus human evaluation pada sampel soal yang sama.
Struktur Dokumen yang Direkomendasikan Setelah Revisi (Ringkas)
Pendahuluan
Latar belakang AQG di pendidikan pemrograman Python berbahasa Indonesia.
Permasalahan utama & gap penelitian.
Dataset
Deskripsi, sumber, ukuran, karakteristik (tetap seperti asli, tanpa Maguru-spesifik).
Metodologi
Preprocessing.
Fine-tuning (LoRA pada model pilihan).
Question Generation.
Distractor Generation.
Studi Komparatif (model-model di atas).
Evaluasi
Metrik otomatis & human evaluation.
Hasil komparatif (tabel & analisis).
Kesimpulan
Ringkasan performa terbaik.
Limitasi & saran lanjutan.
Dengan revisi ini, dokumen menjadi lebih tajam, ilmiah, dan mudah dipertahankan sebagai kontribusi mandiri di bidang NLP for Education. Jika Anda setuju, saya dapat menyusun draft teks revisi untuk bagian Pendahuluan dan Metodologi (atau bagian tertentu) sesuai struktur di atas. Silakan beri tahu bagian mana yang ingin didahulukan.