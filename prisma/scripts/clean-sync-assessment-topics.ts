import 'dotenv/config'
import prisma from '../lib/client'

async function cleanAndSyncAssessmentQuestions() {
  console.log('🔄 Memulai pembersihan dan sinkronisasi bank soal...')

  // 1. Cari course 'modul-awal-python'
  const course = await prisma.courses.findFirst({
    where: {
      OR: [{ slug: 'modul-awal-python' }, { id: 'modul-awal-python' }],
    },
    include: {
      sections: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })

  if (!course) {
    console.error('❌ Kursus modul-awal-python tidak ditemukan!')
    process.exit(1)
  }

  console.log(`✅ Kursus ditemukan: "${course.title}" (${course.id})`)

  const lessons = course.sections.flatMap((s) => s.lessons)
  console.log(`📚 Total Materi (${lessons.length}):`)
  lessons.forEach((l, i) => console.log(`   ${i + 1}. [${l.id}] "${l.title}"`))

  // 2. Hapus 5 butir soal lama yang tidak relevan (JavaScript, SQL, Cloud, dsb)
  const legacyQuestionsToDelete = [
    'cmtqmi0pj0000bsgm3zb8nk7r', // Tipe Data & Penanganan Error (Generic)
    'cmtqmi1lm0001bsgm31tejbpt', // Arsitektur Cloud & Skalabilitas
    'cmtqmi2fq0002bsgmzt08wjva', // JavaScript Array Methods
    'cmtqmi3cu0003bsgmw4irsdpd', // Keamanan Web & Autentikasi
    'cmtqmi47r0004bsgmizrqgdaw', // SQL & Basis Data
  ]

  const deletedLegacy = await prisma.assessment_questions.deleteMany({
    where: {
      id: { in: legacyQuestionsToDelete },
    },
  })
  console.log(`🗑️ Berhasil menghapus ${deletedLegacy.count} butir soal lama yang tidak relevan.`)

  // 3. Petakan 10 soal Python yang ada ke judul materi silabus yang tepat
  // Mapping ID ke judul Lesson resmi di silabus
  const topicMapping: Record<string, { lessonTitle: string; microSkill: string }> = {
    'cmu326hu60000bcgm851708ms': {
      lessonTitle: 'Pengenalan Python',
      microSkill: 'Konsep Dasar Pemrograman Python',
    },
    'cmu326iae0001bcgmb4mqfhzt': {
      lessonTitle: 'variable and Assignment',
      microSkill: 'Tipe Data dan Assignment Nilai',
    },
    'cmu326irs0002bcgmhrg2be0u': {
      lessonTitle: 'Menjalankan Kode Program di Lokal',
      microSkill: 'Alur Eksekusi & Lingkungan Lokal',
    },
    'cmu326jgf0003bcgm7rfu3619': {
      lessonTitle: 'Menjalankan kode Program',
      microSkill: 'Alur Eksekusi dan Kontrol Program',
    },
    'cmu326jvs0004bcgmkf37xdoj': {
      lessonTitle: 'Input/Output dan Komentar',
      microSkill: 'Logika Input/Output & Sintaks Kode',
    },
    'cmu32964h0005bcgmwypayu4v': {
      lessonTitle: 'Bersiap Membuat Kode Program di Lokal',
      microSkill: 'Instalasi dan Konfigurasi Environment',
    },
    'cmu3296su0006bcgmnfrqyto1': {
      lessonTitle: 'variable and Assignment',
      microSkill: 'Struktur Data Dasar & Variabel',
    },
    'cmu3297930007bcgm6em5j61g': {
      lessonTitle: 'variable and Assignment',
      microSkill: 'Operasi dan Manipulasi Koleksi Data',
    },
    'cmu3297mv0008bcgm92tga4t0': {
      lessonTitle: 'Rangkuman: Berkenalan dengan Python',
      microSkill: 'Sintesis Pengetahuan Dasar Python',
    },
    'cmu32981t0009bcgm23syvsow': {
      lessonTitle: 'Pengenalan Python',
      microSkill: 'Fitur Utama dan Karakteristik Python',
    },
  }

  let updatedCount = 0
  for (const [qId, { lessonTitle, microSkill }] of Object.entries(topicMapping)) {
    const q = await prisma.assessment_questions.findUnique({
      where: { id: qId },
    })
    if (q) {
      const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      const updatedOpts = {
        ...opts,
        microSkill,
        hints: opts.hints || [
          `Perhatikan konsep inti pada materi "${lessonTitle}".`,
          `Ingat kembali aturan sintaks bahasa Python pada sub-bab ini.`,
        ],
      }

      await prisma.assessment_questions.update({
        where: { id: qId },
        data: {
          topic: lessonTitle,
          options: updatedOpts,
        },
      })
      updatedCount++
      console.log(`   ✏️ Soal [${qId}] disinkronkan ke Topik: "${lessonTitle}"`)
    }
  }

  console.log(`✅ Sukses menyinkronkan ${updatedCount} soal ke silabus materi!`)

  // 4. Reset User Assessment agar siswa dapat menguji kuis baru yang bersih
  const deletedAssessments = await prisma.user_assessments.deleteMany({
    where: { courseId: course.id },
  })
  console.log(`🔄 Mereset ${deletedAssessments.count} riwayat pengerjaan tes sebelumnya.`)

  console.log('🎉 Pembersihan dan sinkronisasi bank soal selesai dengan sukses!')
}

cleanAndSyncAssessmentQuestions()
  .catch((err) => {
    console.error('❌ Gagal menjalankan migrasi pembersihan:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
