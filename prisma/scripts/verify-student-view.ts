import 'dotenv/config'
import prisma from '../lib/client'
import { sectionService } from '../../features/cms/services/section.service'
import { progressService } from '../../features/cms/services/progress.service'

async function verify() {
  console.log('🧪 Memverifikasi pemisahan draft vs published...')

  // 1. Cek Section yang terlihat oleh Siswa
  const sectionsData = await sectionService.getSectionsWithLessons('modul-awal-python')
  if (!sectionsData) {
    console.error('Course not found in sectionService')
    return
  }

  console.log(`Course ID: ${sectionsData.courseId}`)
  console.log(`Course Status: ${sectionsData.courseStatus}`)
  console.log(`Sections yang dikembalikan untuk siswa: ${sectionsData.sections.length} section(s)`)
  sectionsData.sections.forEach((s) => {
    console.log(` - [Order ${s.order}] "${s.title}" (${s.lessons.length} lessons)`)
  })

  // 2. Cek lesson progress salah satu user yang sudah belajar
  const sampleProgress = await prisma.lesson_progress.findFirst({
    where: {
      lessons: {
        sections: {
          courseId: sectionsData.courseId,
        },
      },
    },
    select: { userId: true },
  })

  if (sampleProgress) {
    const progress = await progressService.getCourseProgress('modul-awal-python', sampleProgress.userId)
    console.log(`Student Progress:`, {
      userId: progress.userId,
      completedLessons: progress.completedLessons,
      totalLessons: progress.totalLessons,
      percentage: `${progress.percentage.toFixed(1)}%`,
    })
  } else {
    console.log('Tidak ada user progress ditemukan.')
  }
}

verify().then(() => prisma.$disconnect())
