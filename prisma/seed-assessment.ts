import prisma from './lib/client'

async function main() {
  console.log('Seeding assessment questions...')

  // Get the first available course to associate questions with
  const course = await prisma.courses.findFirst({
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!course) {
    console.error('❌ Error: No courses found in the database. Please run general seed first.')
    process.exit(1)
  }

  console.log(`Found course: "${course.title}" (ID: ${course.id})`)

  // Check if course has sections, if not, create a dummy one for Section Quiz testing
  let sectionId: string | null = null
  if (course.sections.length > 0) {
    sectionId = course.sections[0].id
    console.log(`Using section: "${course.sections[0].title}" (ID: ${sectionId}) for Section Quiz questions`)
  } else {
    // Create a section
    const newSection = await prisma.sections.create({
      data: {
        id: crypto.randomUUID(),
        courseId: course.id,
        title: 'Pengenalan Dasar',
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    sectionId = newSection.id
    console.log(`Created new section: "${newSection.title}" (ID: ${sectionId}) for Section Quiz questions`)
  }

  // Define seed questions
  const preTestQuestions = [
    {
      id: 'pre-q1',
      courseId: course.id,
      sectionId: null,
      question: 'Manakah dari berikut ini yang merupakan tipe data bawaan dalam Python untuk menyimpan teks?',
      options: {
        a: 'int',
        b: 'str',
        c: 'float',
        d: 'bool',
      },
      correct: 'b',
      topic: 'variables',
      difficulty: 'easy',
    },
    {
      id: 'pre-q2',
      courseId: course.id,
      sectionId: null,
      question: 'Bagaimana cara mendeklarasikan variabel x bernilai bilangan bulat 5 di Python?',
      options: {
        a: 'x = 5',
        b: 'int x = 5',
        c: 'var x = 5',
        d: 'x := 5',
      },
      correct: 'a',
      topic: 'variables',
      difficulty: 'easy',
    },
    {
      id: 'pre-q3',
      courseId: course.id,
      sectionId: null,
      question: 'Pernyataan manakah yang digunakan untuk mengulang blok kode selama kondisi bernilai True?',
      options: {
        a: 'for',
        b: 'if',
        c: 'while',
        d: 'repeat',
      },
      correct: 'c',
      topic: 'loops',
      difficulty: 'medium',
    },
    {
      id: 'pre-q4',
      courseId: course.id,
      sectionId: null,
      question: 'Manakah cara yang benar untuk mendefinisikan sebuah fungsi di Python?',
      options: {
        a: 'function myFunc():',
        b: 'def myFunc():',
        c: 'void myFunc():',
        d: 'define myFunc():',
      },
      correct: 'b',
      topic: 'functions',
      difficulty: 'medium',
    },
  ]

  const sectionQuizQuestions = [
    {
      id: 'sec-q1',
      courseId: course.id,
      sectionId: sectionId,
      question: 'Berapakah output dari kode berikut: print(10 // 3)?',
      options: {
        a: '3.333',
        b: '3',
        c: '1',
        d: '9',
      },
      correct: 'b',
      topic: 'operators',
      difficulty: 'easy',
    },
    {
      id: 'sec-q2',
      courseId: course.id,
      sectionId: sectionId,
      question: 'Apakah hasil evaluasi dari ekspresi: True and False?',
      options: {
        a: 'True',
        b: 'False',
        c: 'None',
        d: 'Error',
      },
      correct: 'b',
      topic: 'boolean-logic',
      difficulty: 'easy',
    },
  ]

  const allQuestions = [...preTestQuestions, ...sectionQuizQuestions]

  // Seed questions using upsert to avoid duplicate key issues on multiple runs
  let insertedCount = 0
  for (const q of allQuestions) {
    await prisma.assessment_questions.upsert({
      where: { id: q.id },
      update: {
        courseId: q.courseId,
        sectionId: q.sectionId,
        question: q.question,
        options: q.options,
        correct: q.correct,
        topic: q.topic,
        difficulty: q.difficulty,
        updatedAt: new Date(),
      },
      create: {
        id: q.id,
        courseId: q.courseId,
        sectionId: q.sectionId,
        question: q.question,
        options: q.options,
        correct: q.correct,
        topic: q.topic,
        difficulty: q.difficulty,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    insertedCount++
  }

  console.log(`✅ Success: Seeded ${insertedCount} questions successfully!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
