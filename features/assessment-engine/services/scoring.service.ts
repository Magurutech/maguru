export const PLACEMENT_THRESHOLD = 70 // Placement threshold percentage

export interface QuestionForScoring {
  id: string
  correct: string
  topic: string
}

export interface TopicStat {
  correct: number
  total: number
  percentage: number
}

export interface ScoreCalculationResult {
  overallScore: number
  topicScores: Record<string, number>
  totalQuestions: number
  correctCount: number
  wrongCount: number
  topicDetails: Record<string, TopicStat>
}

/**
 * Calculates overall and per-topic scores with case-insensitivity,
 * whitespace trimming, and comprehensive debug logging.
 */
export function calculateScores(
  questions: QuestionForScoring[],
  answers: Record<string, string>,
): ScoreCalculationResult {
  if (!questions || questions.length === 0) {
    return {
      overallScore: 0,
      topicScores: {},
      totalQuestions: 0,
      correctCount: 0,
      wrongCount: 0,
      topicDetails: {},
    }
  }

  let totalCorrect = 0
  const topicStats: Record<string, TopicStat> = {}
  const debugAuditLog: Array<{
    id: string
    topic: string
    studentAnswer: string
    correctAnswer: string
    isCorrect: boolean
  }> = []

  for (const q of questions) {
    const rawStudentAnswer = answers[q.id]
    const rawCorrectAnswer = q.correct

    // Normalize both answers: string conversion, trim, and lowercase
    const studentClean = (rawStudentAnswer ?? '').toString().trim().toLowerCase()
    const correctClean = (rawCorrectAnswer ?? '').toString().trim().toLowerCase()

    const isCorrect = studentClean !== '' && studentClean === correctClean
    if (isCorrect) {
      totalCorrect++
    }

    // Accumulate topic-level stats
    const topicKey = q.topic || 'General'
    if (!topicStats[topicKey]) {
      topicStats[topicKey] = { correct: 0, total: 0, percentage: 0 }
    }
    topicStats[topicKey].total++
    if (isCorrect) {
      topicStats[topicKey].correct++
    }

    debugAuditLog.push({
      id: q.id,
      topic: topicKey,
      studentAnswer: rawStudentAnswer ?? '(Not Answered)',
      correctAnswer: rawCorrectAnswer,
      isCorrect,
    })
  }

  // Calculate percentage scores
  const overallScore = Math.round((totalCorrect / questions.length) * 100)

  const topicScores: Record<string, number> = {}
  for (const [topic, stats] of Object.entries(topicStats)) {
    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    stats.percentage = pct
    topicScores[topic] = pct
  }

  // Detailed debug logger for development inspection & verification
  console.group(`[Assessment Scoring Engine] 🎯 Score Calculation Audit`)
  console.log(`📊 Summary: ${totalCorrect}/${questions.length} Correct (${overallScore}%)`)
  console.table(
    debugAuditLog.map((log, idx) => ({
      '#': idx + 1,
      'Question ID': log.id.slice(0, 10),
      'Topic': log.topic,
      'Student Answer': log.studentAnswer,
      'Correct Answer': log.correctAnswer,
      'Result': log.isCorrect ? '✅ CORRECT' : '❌ WRONG',
    }))
  )
  console.log('📌 Topic Breakdown:', topicStats)
  console.groupEnd()

  return {
    overallScore,
    topicScores,
    totalQuestions: questions.length,
    correctCount: totalCorrect,
    wrongCount: questions.length - totalCorrect,
    topicDetails: topicStats,
  }
}
