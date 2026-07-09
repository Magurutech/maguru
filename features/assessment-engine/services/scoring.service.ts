export const PLACEMENT_THRESHOLD = 70 // Hardcoded for MVP

interface Question {
  id: string
  correct: string
  topic: string
}

export function calculateScores(
  questions: Question[],
  answers: Record<string, string>,
) {
  if (questions.length === 0) {
    return { overallScore: 0, topicScores: {} }
  }

  let totalCorrect = 0
  const topicStats: Record<string, { correct: number; total: number }> = {}

  for (const q of questions) {
    const isCorrect = answers[q.id] === q.correct
    if (isCorrect) totalCorrect++

    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { correct: 0, total: 0 }
    }
    topicStats[q.topic].total++
    if (isCorrect) {
      topicStats[q.topic].correct++
    }
  }

  const overallScore = (totalCorrect / questions.length) * 100

  const topicScores: Record<string, number> = {}
  for (const [topic, stats] of Object.entries(topicStats)) {
    topicScores[topic] = (stats.correct / stats.total) * 100
  }

  return { overallScore, topicScores }
}
