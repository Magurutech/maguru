import 'dotenv/config'
import prisma from '../lib/client'

async function inspectCourse() {
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
            select: { id: true, title: true, order: true },
          },
        },
      },
      releases: {
        orderBy: { version: 'desc' },
      },
    },
  })

  if (!course) {
    console.log('Course not found')
    return
  }

  console.log('Course:', {
    id: course.id,
    title: course.title,
    status: course.status,
    publishedVersion: course.publishedVersion,
    lessonsCountField: course.lessons,
  })

  console.log('Existing releases:', course.releases.length)

  console.log('Sections in DB:')
  course.sections.forEach((s, idx) => {
    console.log(`[Section #${idx + 1}] ID: ${s.id}, Order: ${s.order}, Title: "${s.title}" (${s.lessons.length} lessons)`)
    s.lessons.forEach((l) => {
      console.log(`   - [${l.order}] ${l.title} (ID: ${l.id})`)
    })
  })
}

inspectCourse().then(() => prisma.$disconnect())
