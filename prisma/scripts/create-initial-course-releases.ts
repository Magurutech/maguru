import 'dotenv/config'
import prisma from '../lib/client'

async function seedInitialRelease() {
  console.log('🔄 Memulai pembuatan initial release v1 untuk Modul Awal Python...')

  const course = await prisma.courses.findFirst({
    where: {
      OR: [{ slug: 'modul-awal-python' }, { id: 'modul-awal-python' }],
    },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })

  if (!course) {
    console.error('❌ Course modul-awal-python tidak ditemukan!')
    process.exit(1)
  }

  console.log(`Course: "${course.title}" (${course.id})`)
  console.log(`Jumlah section saat ini di DB: ${course.sections.length}`)

  // Section 1 adalah materi yang sudah dirilis pada v1
  const v1Sections = course.sections.filter((s) => s.order === 1)
  const v1TotalLessons = v1Sections.reduce((acc, s) => acc + s.lessons.length, 0)

  console.log(`V1 Sections: ${v1Sections.map((s) => `"${s.title}" (${s.lessons.length} lessons)`).join(', ')}`)
  console.log(`Total lessons untuk V1: ${v1TotalLessons}`)

  const snapshotV1 = {
    version: 1,
    courseId: course.id,
    title: course.title,
    description: course.description,
    totalLessons: v1TotalLessons,
    publishedAt: new Date().toISOString(),
    sections: v1Sections.map((s) => ({
      id: s.id,
      courseId: s.courseId,
      title: s.title,
      description: s.description,
      order: s.order,
      lessonCount: s.lessons.length,
      lessons: s.lessons.map((l) => ({
        id: l.id,
        sectionId: l.sectionId,
        title: l.title,
        order: l.order,
        content: l.content,
      })),
    })),
  }

  // Upsert course_releases v1
  await prisma.course_releases.upsert({
    where: {
      courseId_version: {
        courseId: course.id,
        version: 1,
      },
    },
    update: {
      title: course.title,
      description: course.description,
      totalLessons: v1TotalLessons,
      snapshot: snapshotV1 as any,
    },
    create: {
      id: crypto.randomUUID(),
      courseId: course.id,
      version: 1,
      title: course.title,
      description: course.description,
      totalLessons: v1TotalLessons,
      snapshot: snapshotV1 as any,
      creatorId: course.creatorId,
      publishedAt: new Date(),
    },
  })

  // Update course publishedVersion to 1 and lessons to 7
  await prisma.courses.update({
    where: { id: course.id },
    data: {
      status: 'PUBLISHED',
      publishedVersion: 1,
      lessons: v1TotalLessons,
    },
  })

  console.log('✅ Berhasil membuat initial release v1 dan menghubungkan ke course!')
}

seedInitialRelease().then(() => prisma.$disconnect())
