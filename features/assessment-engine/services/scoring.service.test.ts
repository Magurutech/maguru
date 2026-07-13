import { calculateScores, PLACEMENT_THRESHOLD } from './scoring.service'

describe('calculateScores', () => {
  const sampleQuestions = [
    { id: 'q1', correct: 'a', topic: 'variables' },
    { id: 'q2', correct: 'b', topic: 'variables' },
    { id: 'q3', correct: 'c', topic: 'loops' },
    { id: 'q4', correct: 'd', topic: 'loops' },
  ]

  it('calculates 100% correct answers', () => {
    const answers = { q1: 'a', q2: 'b', q3: 'c', q4: 'd' }
    const result = calculateScores(sampleQuestions, answers)

    expect(result.overallScore).toBe(100)
    expect(result.topicScores['variables']).toBe(100)
    expect(result.topicScores['loops']).toBe(100)
  })

  it('calculates 0% correct answers', () => {
    const answers = { q1: 'b', q2: 'c', q3: 'd', q4: 'a' }
    const result = calculateScores(sampleQuestions, answers)

    expect(result.overallScore).toBe(0)
    expect(result.topicScores['variables']).toBe(0)
    expect(result.topicScores['loops']).toBe(0)
  })

  it('calculates mixed topic scores correctly', () => {
    // variables: q1 correct ('a'), q2 incorrect ('c') => 50%
    // loops: q3 correct ('c'), q4 correct ('d') => 100%
    // overall: 3/4 = 75%
    const answers = { q1: 'a', q2: 'c', q3: 'c', q4: 'd' }
    const result = calculateScores(sampleQuestions, answers)

    expect(result.overallScore).toBe(75)
    expect(result.topicScores['variables']).toBe(50)
    expect(result.topicScores['loops']).toBe(100)
  })

  it('returns 0 and empty scores for empty question set', () => {
    const result = calculateScores([], {})
    expect(result.overallScore).toBe(0)
    expect(result.topicScores).toEqual({})
  })

  it('correctly handles boundary for placement threshold', () => {
    expect(PLACEMENT_THRESHOLD).toBe(70)
    
    // 50% score (1 out of 2 variables questions correct)
    const answersBelow = { q1: 'a', q2: 'x', q3: 'x', q4: 'x' }
    const resultBelow = calculateScores(sampleQuestions, answersBelow)
    expect(resultBelow.topicScores['variables']).toBe(50)
    expect(resultBelow.topicScores['variables']).toBeLessThan(PLACEMENT_THRESHOLD)

    // 70% boundary check: 7 correct out of 10 loops questions
    const tenQuestions = Array.from({ length: 10 }, (_, i) => ({
      id: `q${i}`,
      correct: 'a',
      topic: 'loops',
    }))
    const answersExactlyPass = Object.fromEntries(
      tenQuestions.map((q, i) => [q.id, i < 7 ? 'a' : 'b']),
    )
    const resultExactlyPass = calculateScores(tenQuestions, answersExactlyPass)
    expect(resultExactlyPass.topicScores['loops']).toBe(70)
    expect(resultExactlyPass.topicScores['loops']).toBeGreaterThanOrEqual(PLACEMENT_THRESHOLD)
  })
})
