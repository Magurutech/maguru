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
}

export async function fetchAIGeneratedQuiz(params: {
  courseId: string;
  sectionId?: string | null;
  numQuestions?: number;
  difficulty?: string;
  lessonContent?: string;
}): Promise<AIQuizQuestion[]> {
  const baseUrl = process.env.NEXT_PUBLIC_LANGSERVE_URL || 'http://localhost:8000';
  const endpoint = `${baseUrl}/api/v1/generate-quiz`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course_id: params.courseId,
        section_id: params.sectionId || null,
        num_questions: params.numQuestions || 5,
        difficulty: params.difficulty || 'medium',
        lesson_content: params.lessonContent || null,
      }),
    });

    if (!response.ok) {
      console.warn(`[AI Quiz Generator] API returned status ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.questions)) {
      return data.questions;
    }
    return [];
  } catch (error) {
    console.error('[AI Quiz Generator] Network error calling maguru-model:', error);
    return [];
  }
}
