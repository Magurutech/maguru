Oke, kita masuk ke materi Capabilities & Limitations di Deep Dive 1.
Berarti fokusnya adalah: apa yang generative AI bisa lakukan dengan baik vs batasan-batasannya.

Capabilities (Kekuatan)
Konten Baru

Membuat teks, kode, gambar, audio, video dari nol atau memodifikasi konten yang ada.

Contoh: membuat PRD, menulis boilerplate code, generate dokumentasi.

Adaptasi Gaya & Format

Bisa meniru gaya bahasa, menyesuaikan format dokumen, bahkan menulis ulang sesuai audiens.

Pemrosesan Bahasa & Pengetahuan Umum

Mengerti konteks percakapan (walau tidak memahami seperti manusia) dan memanfaatkan pengetahuan yang dilatih.

Asisten Multi-Task

Bisa brainstorming, merangkum, membuat instruksi, atau memecah masalah menjadi langkah-langkah.

Limitations (Batasan)
Tidak Benar-benar Mengerti

AI hanya memprediksi output paling mungkin → bisa menghasilkan jawaban yang tampak benar tapi salah (hallucination).

Data Latih Terbatas Waktu

Tidak selalu punya informasi terbaru kecuali dihubungkan dengan real-time search.

Sensitif pada Prompt

Output sangat bergantung pada bagaimana pertanyaannya disusun.

Bias & Kualitas Data Latih

Kalau datanya bias, output-nya bisa ikut bias.

Tidak Punya Penilaian Moral atau Tujuan

Keputusan “baik” atau “buruk” datang dari manusia, bukan AI.

Kalau kamu mau, kita bisa langsung bikin ringkasan visual tabel capabilities vs limitations supaya lebih gampang diingat dan bisa dipakai waktu presentasi atau ujian AI Fluency.

Mau aku buatkan tabelnya sekarang?

iya, itu  akan sangat membantu,

dan saya juga ingin bertanya  Generative AI memiliki beberapa Limitations ( Batsan ) bagaimaan cara agar kita bisa improve batasan ini?

Oke, aku buatkan dulu tabel Capabilities vs Limitations biar rapi, lalu aku jelasin strategi untuk improve setiap batasan generative AI.

Capabilities vs Limitations Generative AI
Capabilities (Kekuatan)

Limitations (Batasan)

Membuat teks, kode, gambar, audio, video baru.

Bisa menghasilkan jawaban salah walau terdengar meyakinkan (hallucination).

Menyesuaikan gaya, format, atau bahasa sesuai audiens.

Pengetahuan terbatas sampai tanggal data latih.

Memahami konteks percakapan secara statistical.

Sangat tergantung pada kualitas dan kejelasan prompt.

Memecah masalah jadi langkah-langkah, brainstorming ide.

Bisa mewarisi bias dari data latih.

Menyediakan bantuan multi-task lintas domain.

Tidak punya pemahaman atau penilaian moral seperti manusia.

Cara Improve Limitations
Hallucination
✅ Mitigasi:

Gunakan retrieval-augmented generation (RAG) → hubungkan AI ke database atau search API.

Lakukan fact-checking manual atau minta AI mencantumkan sumber.

Beri prompt “jika tidak yakin, jawab tidak tahu”.

Pengetahuan Tidak Terbaru
✅ Mitigasi:

Hubungkan ke sumber real-time (misalnya browsing atau API eksternal).

Update model secara berkala (fine-tuning dengan data terbaru).

Prompt Sensitivity
✅ Mitigasi:

Gunakan teknik prompt engineering (role + context + instruction).

Terapkan chain-of-thought prompting → suruh AI berpikir langkah demi langkah.

Buat prompt template yang teruji.

Bias dari Data Latih
✅ Mitigasi:

Gunakan bias detection tools.

Kurasi atau fine-tune model dengan dataset yang berimbang dan bebas bias.

Lakukan human-in-the-loop review.

Tidak Punya Moral/Judgement
✅ Mitigasi:

Tambahkan governance layer / guardrails di aplikasi.

Gunakan aturan atau kebijakan yang jelas untuk menyaring output.

Selalu libatkan keputusan akhir oleh manusia.

Kalau mau, aku bisa bikin versi visual mindmap yang menunjukkan limitations → cara mengatasinya supaya lebih mudah kamu jelaskan di kelas atau ke tim.

Mau aku buatkan mindmap-nya?

biskaha kau jelaskan lebih detail terkaiat Cara improve Limitations nya dan bisa uji pemahaman saya

Oke, kita bikin versi detailnya per limitation supaya benar-benar paham, lalu nanti aku kasih quiz cepat buat uji pemahaman kamu.

Cara Improve Limitations Generative AI – Detail
1. Hallucination
Masalah: Model menciptakan fakta yang tidak benar, tetapi disajikan seolah benar.

Kenapa terjadi: Model hanya memprediksi kata berikutnya berdasarkan pola, bukan memverifikasi kebenaran.

Cara mengatasi:

Retrieval-Augmented Generation (RAG): Hubungkan AI ke knowledge base atau API pencarian agar ia menarik fakta dari sumber nyata.

Cross-check: Perintahkan AI memeriksa jawabannya dengan sumber eksternal atau mengakui jika tidak yakin.

Prompting khusus: Misalnya:



Jika Anda tidak yakin, katakan "tidak yakin" dan beri saran sumber yang dapat dicek.
Human review: Semua informasi penting diverifikasi manusia.

2. Pengetahuan Tidak Terbaru
Masalah: Model tidak tahu kejadian setelah cut-off date pelatihan.

Kenapa terjadi: Data latih statis; model tidak belajar secara real-time.

Cara mengatasi:

Integrasi real-time search/API: Seperti plugin browsing atau koneksi ke database dinamis.

Fine-tuning berkala: Melatih ulang dengan data terbaru.

Hybrid system: Kombinasi AI + retrieval pipeline.

3. Prompt Sensitivity
Masalah: Output sangat bergantung pada cara prompt ditulis; prompt kurang jelas → hasil buruk.

Kenapa terjadi: Model mengandalkan konteks yang diberikan pengguna.

Cara mengatasi:

Prompt engineering: Sertakan peran, tujuan, dan format output.

Chain-of-thought prompting: Suruh AI menjelaskan proses berpikir langkah demi langkah.

Prompt template: Standarisasi prompt untuk kebutuhan tertentu.

Iterasi: Uji beberapa variasi prompt, lihat mana paling efektif.

4. Bias dari Data Latih
Masalah: AI bisa memunculkan stereotip atau diskriminasi.

Kenapa terjadi: Data latih mengandung bias sosial, budaya, atau politik.

Cara mengatasi:

Bias detection tools: Gunakan alat analisis bias pada output.

Dataset kurasi: Gunakan data pelatihan yang seimbang dan bebas bias.

Fine-tuning anti-bias: Latih model dengan data yang dirancang untuk menetralkan bias.

Human-in-the-loop: Libatkan manusia untuk menyaring output.

5. Tidak Punya Moral/Judgement
Masalah: AI tidak mengerti etika, hukum, atau konteks sosial secara manusiawi.

Kenapa terjadi: Model hanya memproses pola teks, bukan nilai moral.

Cara mengatasi:

Governance layer: Tambahkan filter dan kebijakan sebelum output keluar.

Rule-based control: Tetapkan aturan jelas (misalnya dilarang memberikan saran medis tanpa sumber).

Human oversight: Keputusan akhir selalu di tangan manusia.

Context injection: Beri panduan etis di prompt.

Mini Quiz – Uji Pemahaman
Aku kasih 3 pertanyaan, kamu jawab tanpa lihat catatan:

Kalau AI menghasilkan jawaban meyakinkan tapi ternyata salah, itu disebut apa, dan cara paling efektif mengatasinya apa?

Apa strategi yang bisa dipakai agar AI tetap tahu informasi terbaru tanpa melatih ulang model dari nol?

Sebutkan satu cara untuk mengurangi bias dalam output AI selain fine-tuning.


