export interface CourseMockData {
  outcomes: string[]
  aiCoTeacher: {
    question: string
    answer: string
    benefits: string[]
  }
  courseProject: {
    title: string
    description: string
    deliverables: string[]
    portfolioValue: string
  }
  instructor: {
    name: string
    title: string
    avatar: string
    bio: string
    experience: string
    studentsCount: number
    coursesCount: number
    rating: number
  }
  reviews: {
    id: string
    name: string
    date: string
    rating: number
    comment: string
  }[]
}

const defaultMock: CourseMockData = {
  outcomes: [
    'Menguasai konsep dasar dan fundamental secara menyeluruh',
    'Membangun produk nyata dari awal hingga tahap deployment',
    'Menerapkan best practices industri dalam penulisan kode dan arsitektur',
    'Berkolaborasi secara terarah menggunakan teknologi modern'
  ],
  aiCoTeacher: {
    question: 'Bagaimana cara terbaik untuk mengoptimalkan bagian ini?',
    answer: 'Untuk bagian ini, Anda dapat memanfaatkan caching atau meminimalkan pembacaan database berulang. Coba gunakan strategi state management yang efisien atau batasi query Prisma Anda dengan filter select.',
    benefits: [
      'Bantuan penjelasan konsep 24/7',
      'Feedback kode instan yang personal',
      'Rekomendasi latihan penyesuaian kemampuan'
    ]
  },
  courseProject: {
    title: 'Capstone Project: Aplikasi Berbasis Data Nyata',
    description: 'Rancang, bangun, dan deploy sebuah aplikasi production-ready dari nol yang mengintegrasikan seluruh materi yang telah Anda pelajari.',
    deliverables: [
      'Repository GitHub yang bersih dengan README lengkap',
      'Aplikasi web yang ter-deploy dan dapat diakses publik',
      'Dokumentasi teknis arsitektur sistem'
    ],
    portfolioValue: 'Menunjukkan kemampuan pemecahan masalah end-to-end, penulisan kode bersih, dan keterampilan deployment di hadapan perekrut.'
  },
  instructor: {
    name: 'Wira Kusuma',
    title: 'Principal Educator & Tech Architect',
    avatar: 'WK',
    bio: 'Lebih dari 10 tahun pengalaman memimpin tim engineering di berbagai startup regional. Fokus membagikan ilmu praktis yang langsung relevan dengan industri modern.',
    experience: 'Ex-VP of Engineering di TechCorp, Kontributor Open Source.',
    studentsCount: 1420,
    coursesCount: 5,
    rating: 4.9
  },
  reviews: [
    {
      id: 'rev-1',
      name: 'Rian Hidayat',
      date: '12 Juni 2026',
      rating: 5,
      comment: 'Materi yang disajikan sangat sistematis dan terstruktur. Adanya AI Co-Teacher sangat membantu ketika saya stuck di latihan praktis malam hari!'
    },
    {
      id: 'rev-2',
      name: 'Siti Rahma',
      date: '28 Mei 2026',
      rating: 4.8,
      comment: 'Penjelasan instrukturnya sangat jelas dan mudah dipahami. Proyek akhir benar-benar melatih problem solving di dunia nyata.'
    },
    {
      id: 'rev-3',
      name: 'Budi Santoso',
      date: '15 Mei 2026',
      rating: 5,
      comment: 'Pengalaman belajar editorial yang sangat tenang dan menakjubkan. Jauh berbeda dari platform kursus e-learning biasa.'
    }
  ]
}

const customMocks: Record<string, Partial<CourseMockData>> = {
  pemrograman: {
    outcomes: [
      'Menguasai LLM Engineering, integrasi API, dan model deployment',
      'Membangun sistem Retrieval-Augmented Generation (RAG) production-ready',
      'Melakukan fine-tuning model menggunakan teknik QLoRA',
      'Merancang autonomous agent system untuk otomasi workflow'
    ],
    aiCoTeacher: {
      question: 'Bagaimana cara kerja chunking strategy terbaik untuk PDF tebal?',
      answer: 'Untuk dokumen hukum atau PDF tebal, gunakan *RecursiveCharacterTextSplitter* dengan ukuran chunk 1000 token dan overlap 200 token. Gunakan metadata tagging agar pencarian RAG tetap presisi.',
      benefits: [
        'Review kode program baris-per-baris secara real-time',
        'Penjelasan sintaksis dan framework yang kompleks',
        'Saran perbaikan bug dan optimasi query database'
      ]
    },
    courseProject: {
      title: 'Proyek Akhir: Enterprise RAG Chatbot Agent',
      description: 'Bangun sebuah sistem pencarian pintar berbasis AI untuk basis data dokumen internal perusahaan lengkap dengan evaluasi relevansi jawaban.',
      deliverables: [
        'Chatbot web interface yang responsif dan interaktif',
        'Database Vector (Supabase/PGVector) terintegrasi',
        'Analisis metrik evaluasi akurasi jawaban RAG'
      ],
      portfolioValue: 'Membuktikan keahlian Anda dalam merancang arsitektur kecerdasan buatan tingkat lanjut yang sangat dicari oleh startup AI masa kini.'
    },
    instructor: {
      name: 'Dr. Arya Widjaja',
      title: 'Lead AI Scientist & Core Researcher',
      avatar: 'AW',
      bio: 'Doktor Ilmu Komputer dengan fokus penelitian Generative AI dan Natural Language Processing. Berpengalaman merancang sistem cerdas skala besar untuk perbankan dan retail.',
      experience: 'Ex-Senior AI Researcher di GlobalAI Labs, Pembicara Konferensi AI.',
      studentsCount: 2340,
      coursesCount: 3,
      rating: 4.8
    }
  },
  desain: {
    outcomes: [
      'Memahami prinsip-prinsip desain editorial Atelier Zero secara mendalam',
      'Menguasai typography pairing, layout editorial, dan white space',
      'Membuat micro-interactions dan animasi UI yang fungsional',
      'Merancang design system mandiri yang konsisten dan scalable'
    ],
    aiCoTeacher: {
      question: 'Apakah kontras teks abu-abu di atas kertas krem ini sudah cukup?',
      answer: 'Untuk memenuhi standar aksesibilitas WCAG AA, kontras teks harus minimal 4.5:1. Ganti warna teks abu-abu terang Anda menjadi `--color-text-muted` (#5a5448) agar lebih mudah dibaca.',
      benefits: [
        'Review visual layout dan kritik tata letak instan',
        'Rekomendasi kombinasi palet warna dan tipografi',
        'Bimbingan aksesibilitas dan kemudahan navigasi user'
      ]
    },
    courseProject: {
      title: 'Proyek Akhir: Desain Editorial Landing Page Premium',
      description: 'Buatlah sebuah prototipe landing page produk mewah dengan visualisasi motion design yang halus menggunakan Figma dan CSS custom.',
      deliverables: [
        'High-Fidelity UI Prototype di Figma dengan interaction states lengkap',
        'Dokumentasi Design System (Typography, Spacing, Color tokens)',
        'Spesifikasi panduan transisi/animasi detail'
      ],
      portfolioValue: 'Karya portfolio visual tingkat tinggi yang menunjukkan bahwa Anda bukan sekadar desainer template, melainkan desainer digital craft artist.'
    },
    instructor: {
      name: 'Amara zero',
      title: 'Design Director & Editorial Expert',
      avatar: 'AZ',
      bio: 'Konsultan kreatif independen untuk brand-brand gaya hidup premium di Asia. Percaya bahwa keindahan sejati dalam desain digital lahir dari kesederhanaan dan white space.',
      experience: 'Co-founder Atelier Zero Creative Studio, Juri Design Award.',
      studentsCount: 890,
      coursesCount: 2,
      rating: 4.9
    }
  }
}

export function getCourseDetailMock(slug: string, category: string): CourseMockData {
  const normCategory = category.toLowerCase()
  let selectedPartial: Partial<CourseMockData> = {}

  if (normCategory.includes('pemrograman') || normCategory.includes('ai') || normCategory.includes('tech') || normCategory.includes('sains')) {
    selectedPartial = customMocks.pemrograman || {}
  } else if (normCategory.includes('desain') || normCategory.includes('design') || normCategory.includes('seni') || normCategory.includes('art')) {
    selectedPartial = customMocks.desain || {}
  }

  return {
    outcomes: selectedPartial.outcomes || defaultMock.outcomes,
    aiCoTeacher: selectedPartial.aiCoTeacher || defaultMock.aiCoTeacher,
    courseProject: selectedPartial.courseProject || defaultMock.courseProject,
    instructor: selectedPartial.instructor || defaultMock.instructor,
    reviews: selectedPartial.reviews || defaultMock.reviews
  }
}
