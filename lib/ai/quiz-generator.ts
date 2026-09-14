/**
 * AI Quiz Generator Client Service
 * Calls maguru-model backend to automatically generate assessment quiz questions.
 */

export interface AIQuizQuestion {
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correct: 'a' | 'b' | 'c' | 'd';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  hints?: string[];
  micro_skill?: string;
}

export async function fetchAIGeneratedQuiz(params: {
  courseId: string;
  courseTitle?: string;
  sectionId?: string | null;
  numQuestions?: number;
  difficulty?: string;
  questionStyle?: string;
  lessonContent?: string;
}): Promise<AIQuizQuestion[]> {
  const baseUrl = process.env.NEXT_PUBLIC_LANGSERVE_URL || 'http://localhost:8000';
  const endpoint = `${baseUrl}/api/v1/generate-quiz`;

  console.log('[AI Quiz Generator] 🚀 Dispatching request:', {
    endpoint,
    courseId: params.courseId,
    courseTitle: params.courseTitle,
    numQuestions: params.numQuestions || 5,
    difficulty: params.difficulty || 'medium',
    questionStyle: params.questionStyle || 'balanced',
    lessonContentLength: params.lessonContent?.length || 0,
  });

  const startTime = Date.now();
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course_id: params.courseId,
        course_title: params.courseTitle || null,
        section_id: params.sectionId || null,
        num_questions: params.numQuestions || 5,
        difficulty: params.difficulty || 'medium',
        question_style: params.questionStyle || 'balanced',
        lesson_content: params.lessonContent || null,
      }),
    });

    const elapsedMs = Date.now() - startTime;

    if (!response.ok) {
      console.warn(`[AI Quiz Generator] ⚠️ API returned status ${response.status} (${elapsedMs}ms)`);
      return [];
    }

    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.questions)) {
      console.group(`[AI Quiz Generator] ✅ Received ${data.questions.length} questions (${elapsedMs}ms)`);
      console.log('📌 Full Payload:', data.questions);
      try {
        console.table(
          data.questions.map((q: AIQuizQuestion, index: number) => ({
            '#': index + 1,
            'Pertanyaan': q.question?.slice(0, 60) + (q.question?.length > 60 ? '...' : ''),
            'Kunci': q.correct?.toUpperCase(),
            'Opsi A': q.options?.a?.slice(0, 25),
            'Opsi B': q.options?.b?.slice(0, 25),
            'Opsi C': q.options?.c?.slice(0, 25),
            'Opsi D': q.options?.d?.slice(0, 25),
            'Topik': q.topic,
            'Micro-Skill': q.micro_skill || '-',
            'Hints': q.hints?.length ? `${q.hints.length} hints` : '-',
            'Tingkat': q.difficulty,
            'Ada Pembahasan?': q.explanation ? 'Ya' : 'Tidak',
          }))
        );
      } catch (err) {
        console.log('Questions table formatting error:', err);
      }
      console.groupEnd();
      return data.questions;
    }
    console.warn('[AI Quiz Generator] ⚠️ Unexpected response format:', data);
    return [];
  } catch (error) {
    const elapsedMs = Date.now() - startTime;
    console.error(`[AI Quiz Generator] ❌ Network error calling maguru-model (${elapsedMs}ms):`, error);
    return [];
  }
}
