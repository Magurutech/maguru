/**
 * AI Knowledge Ingestion & Sync Client
 * Communicates with maguru-model FastAPI backend for automatic course knowledge vectorization.
 */

export interface LessonSyncPayload {
  courseId: string;
  sectionId?: string | null;
  lessonId: string;
  title: string;
  content: string;
  courseSlug?: string;
}

export interface BulkSyncLessonItem {
  lesson_id: string;
  section_id?: string | null;
  title: string;
  content: string;
}

export interface KnowledgeStatusResult {
  status: string;
  course_id: string;
  total_chunks: number;
  is_synced: boolean;
  last_synced_at?: string | null;
  message: string;
}

export interface BulkSyncResult {
  status: string;
  course_id: string;
  total_lessons: number;
  total_chunks: number;
  message: string;
}

const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_LANGSERVE_URL || process.env.LANGSERVE_URL || 'http://localhost:8000';
};

/**
 * Asynchronously syncs a single lesson's full text content to the AI Vector Store.
 * Non-blocking: will never throw or crash the caller if the AI backend is unreachable.
 */
export async function syncLessonToAI(payload: LessonSyncPayload): Promise<void> {
  if (!payload.courseId || !payload.lessonId || !payload.content?.trim()) {
    return;
  }

  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/api/v1/ingest`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        course_id: payload.courseId,
        section_id: payload.sectionId || null,
        lesson_id: payload.lessonId,
        title: payload.title || '',
        course_slug: payload.courseSlug || '',
        content: payload.content,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[AI Ingest] ⚠️ Sync lesson returned HTTP ${response.status} for lesson ${payload.lessonId}`);
    } else {
      const data = await response.json();
      console.log(`[AI Ingest] ✅ Lesson '${payload.title}' synced (${data.chunks_processed || 0} chunks)`);
    }
  } catch (error: any) {
    // Non-blocking catch to ensure CMS operations are completely unaffected
    console.warn(`[AI Ingest] ⚠️ Background sync skipped for lesson ${payload.lessonId}: ${error?.message || error}`);
  }
}

/**
 * Cascade deletion: Removes vector store chunks for a deleted lesson.
 * Non-blocking: errors are silently logged.
 */
export async function deleteLessonFromAI(courseId: string, lessonId: string): Promise<void> {
  if (!courseId || !lessonId) return;

  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/api/v1/ingest`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await fetch(endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        course_id: courseId,
        lesson_id: lessonId,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log(`[AI Ingest] 🗑️ Removed vector chunks for lesson ${lessonId}`);
  } catch (error: any) {
    console.warn(`[AI Ingest] ⚠️ Could not remove chunks for lesson ${lessonId}: ${error?.message || error}`);
  }
}

/**
 * Bulk synchronize all lessons of a course in a single batch request.
 */
export async function bulkSyncCourseLessonsToAI(
  courseId: string,
  lessons: BulkSyncLessonItem[],
  courseSlug?: string
): Promise<BulkSyncResult> {
  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/api/v1/ingest/bulk`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for bulk

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        course_id: courseId,
        course_slug: courseSlug || '',
        lessons,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`AI Backend returned HTTP ${response.status}`);
    }

    const data: BulkSyncResult = await response.json();
    return data;
  } catch (error: any) {
    console.error(`[AI Ingest] ❌ Bulk sync failed for course ${courseId}:`, error);
    throw error;
  }
}

/**
 * Fetch current knowledge base indexing status for a course.
 */
export async function getKnowledgeBaseStatus(courseId: string): Promise<KnowledgeStatusResult> {
  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/api/v1/ingest/status?course_id=${encodeURIComponent(courseId)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Return graceful fallback offline status
  }

  return {
    status: 'offline',
    course_id: courseId,
    total_chunks: 0,
    is_synced: false,
    message: 'AI knowledge service unreachable or offline',
  };
}
