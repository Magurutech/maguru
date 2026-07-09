import { PLACEMENT_THRESHOLD } from './scoring.service'

interface TransactionClient {
  lessons: {
    findMany(args: {
      where: {
        sections: { courseId: string }
        title: { contains: string; mode: 'insensitive' }
      }
      select: { id: true }
    }): Promise<{ id: string }[]>
  }
  lesson_progress: {
    upsert(args: {
      where: { lessonId_userId: { lessonId: string; userId: string } }
      create: { id: string; lessonId: string; userId: string; completed: boolean; completedAt: Date }
      update: { completed: boolean; completedAt: Date }
    }): Promise<unknown>
  }
}

/**
 * Executes topic-based placement for a student.
 * If score >= 70% for a topic, marks related lessons as complete.
 * Must run inside an active interactive transaction.
 */
export async function executeTopicPlacement(
  userId: string,
  courseId: string,
  topicScores: Record<string, number>,
  tx: TransactionClient,
): Promise<string[]> {
  const skippedLessonIds: string[] = []

  for (const [topic, score] of Object.entries(topicScores)) {
    if (score >= PLACEMENT_THRESHOLD) {
      // Find all lessons for this course where title contains the topic name
      // ponytail: matching via title is an MVP limitation, will be replaced with explicit topic field later
      const lessons = await tx.lessons.findMany({
        where: {
          sections: {
            courseId,
          },
          title: {
            contains: topic,
            mode: 'insensitive',
          },
        },
        select: { id: true },
      })

      for (const lesson of lessons) {
        await tx.lesson_progress.upsert({
          where: {
            lessonId_userId: {
              lessonId: lesson.id,
              userId,
            },
          },
          create: {
            id: crypto.randomUUID(),
            lessonId: lesson.id,
            userId,
            completed: true,
            completedAt: new Date(),
          },
          update: {
            completed: true,
            completedAt: new Date(),
          },
        })
        skippedLessonIds.push(lesson.id)
      }
    }
  }

  return skippedLessonIds
}
