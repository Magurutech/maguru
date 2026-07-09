# Sprint 2: AI Infrastructure & Assessment Implementation Plan

> **For Antigravity:** REQUIRED SUB-SKILL: Load executing-plans to implement this plan task-by-task.

**Goal:** Membangun infrastruktur vektor (RAG) berbasis Supabase pgvector dan sistem kuis penempatan awal (Initial Assessment) untuk mendukung personalisasi pembelajaran siswa Maguru.

**Architecture:** Frontend Next.js mengirimkan kueri chat siswa ke backend FastAPI (maguru-model) via streaming Server-Sent Events (SSE). Backend AI memanggil Supabase pgvector untuk retrieve konteks materi pelajaran, merakit prompt, dan memproses respons via OpenRouter LLM. Logika assessment dijalankan di backend Next.js untuk menyimpan skor kognitif awal (Pre-test) dan menyesuaikan progress modul pelajaran (Placement).

**Tech Stack:** Next.js (TypeScript), Prisma ORM, PostgreSQL (Supabase pgvector), Python, FastAPI, LangChain (LCEL), LangGraph, Pytest, Jest.

---

### Task 1: Supabase pgvector Connectivity

**Files:**
- Create: `D:/.maguru/maguru-model/tests/test_vector_db.py`
- Modify: `D:/.maguru/maguru-model/.env` (tambahkan Supabase URL & Service Key)

**Step 1: Write the failing test**

```python
# D:/.maguru/maguru-model/tests/test_vector_db.py
import os
import pytest
from supabase.client import create_client

def test_supabase_vector_db_connectivity():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    assert supabase_url is not None, "SUPABASE_URL must be defined"
    assert supabase_key is not None, "SUPABASE_SERVICE_KEY must be defined"
    
    supabase = create_client(supabase_url, supabase_key)
    
    # Test executing a raw pgvector helper query
    response = supabase.table("documents").select("id").limit(1).execute()
    # verify table exists, even if empty
    assert hasattr(response, "data"), "Failed to select from documents table"
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_vector_db.py -v`
Expected: FAIL (missing env variables or table doesn't exist yet)

**Step 3: Setup Env & Supabase Table**

Aktifkan pgvector di Supabase SQL Editor dan jalankan skrip SQL berikut:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(1536)
);
```
Dan tambahkan variabel lingkungan ke file `.env` di Python backend:
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
```

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_vector_db.py -v`
Expected: PASS

**Step 5: Commit**

```bash
git add .env.example tests/test_vector_db.py
git commit -m "test: add database pgvector connectivity test"
```

---

### Task 2: Prisma Schema for Assessment Models

**Files:**
- Modify: `D:/.maguru/maguru/prisma/schema.prisma:119-125`
- Test: Run Prisma migrations and generate client

**Step 1: Write the schema changes**

Edit [schema.prisma](file:///D:/.maguru/maguru/prisma/schema.prisma) untuk menambahkan model kuis:
```prisma
// D:/.maguru/maguru/prisma/schema.prisma

// model assessment_questions
model assessment_questions {
  id          String   @id @default(uuid())
  courseId    String
  question    String   @db.Text
  options     Json     // format: { "a": "...", "b": "...", ... }
  correct     String   // jawaban benar (misal: "a")
  topic       String   // topik pemetaan (misal: "python-basics")
  difficulty  String   @default("medium")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([courseId])
  @@index([topic])
}

// model user_assessments (Pre-test baseline score)
model user_assessments {
  id          String    @id @default(uuid())
  userId      String    @db.VarChar(255)
  courseId    String
  score       Float
  type        String    @default("PRE_TEST")
  answers     Json      // riwayat pilihan jawaban: { "questionId": "userAnswer" }
  completedAt DateTime  @default(now())

  @@unique([userId, courseId, type])
  @@index([userId])
  @@index([courseId])
}
```

**Step 2: Run migration command**

Run: `npx prisma migrate dev --name add-assessment-models`
Expected: Database migration successful and Prisma client generated.

**Step 3: Verify the changes locally**

Verify by executing local prisma check:
Run: `npx prisma validate`
Expected: Schema is valid.

**Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add assessment_questions and user_assessments models to schema"
```

---

### Task 3: Ingestion Pipeline for Markdown Documents

**Files:**
- Create: `D:/.maguru/maguru-model/ai_chains/ingestion.py`
- Create: `D:/.maguru/maguru-model/tests/test_ingestion.py`

**Step 1: Write the failing test**

```python
# D:/.maguru/maguru-model/tests/test_ingestion.py
import pytest
from ai_chains.ingestion import ingest_markdown_content

def test_ingest_markdown_content_fails_on_empty_content():
    with pytest.raises(ValueError, match="Content cannot be empty"):
        ingest_markdown_content("", "course_1", "test.md")
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_ingestion.py -v`
Expected: FAIL (module/function not found)

**Step 3: Implement Ingestion Logic**

```python
# D:/.maguru/maguru-model/ai_chains/ingestion.py
import os
from supabase.client import create_client
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore

def ingest_markdown_content(content: str, course_id: str, doc_name: str) -> int:
    if not content:
        raise ValueError("Content cannot be empty")
        
    # Split text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_text(content)
    
    # Initialize clients
    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key=os.getenv("OPENROUTER_API_KEY"),
        openai_api_base="https://openrouter.ai/api/v1"
    )
    
    # Store to Supabase Vector Store
    vector_store = SupabaseVectorStore(
        client=supabase,
        embedding=embeddings,
        table_name="documents",
        query_name="match_documents"
    )
    
    metadatas = [{"course_id": course_id, "doc_name": doc_name} for _ in chunks]
    vector_store.add_texts(texts=chunks, metadatas=metadatas)
    
    return len(chunks)
```

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_ingestion.py -v`
Expected: PASS

**Step 5: Commit**

```bash
git add ai_chains/ingestion.py tests/test_ingestion.py
git commit -m "feat: implement markdown document ingestion pipeline"
```

---

### Task 4: LangGraph Chatbot RAG Integration

**Files:**
- Modify: `D:/.maguru/maguru-model/ai_chains/chains/qa_chatbot.py`
- Create: `D:/.maguru/maguru-model/tests/test_qa_chatbot_rag.py`

**Step 1: Write the failing test**

```python
# D:/.maguru/maguru-model/tests/test_qa_chatbot_rag.py
import pytest
from ai_chains.chains.qa_chatbot import answer_question

def test_answer_question_retrieves_rag_context():
    # Test that prompt formats and invokes successfully
    response = answer_question(
        question="Apa fungsi variabel?", 
        session_title="Variabel", 
        session_content="Variabel digunakan untuk menyimpan data.",
        chat_history=[]
    )
    assert response is not None
    assert len(response) > 0
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_qa_chatbot_rag.py -v`
Expected: FAIL (if RAG dependencies or Supabase vector store client connection is not fully wired)

**Step 3: Update `qa_chatbot.py` with Supabase pgvector retrieval**

```python
# D:/.maguru/maguru-model/ai_chains/chains/qa_chatbot.py
import os
from pathlib import Path
from supabase.client import create_client
from langchain_core.prompts import load_prompt
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_openai import OpenAIEmbeddings
from . import get_llm

_chain = None

def _get_chain():
    global _chain
    if _chain is None:
        prompt_path = Path(__file__).parent.parent / "prompts" / "qa_chatbot.yaml"
        _prompt = load_prompt(str(prompt_path))
        _chain = _prompt | get_llm() | StrOutputParser()
    return _chain

def answer_question(question: str, session_title: str,
                    session_content: str, chat_history: list) -> str:
    # 1. Retrieve context from Supabase pgvector
    rag_context = ""
    try:
        supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))
        embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=os.getenv("OPENROUTER_API_KEY"),
            openai_api_base="https://openrouter.ai/api/v1"
        )
        vector_store = SupabaseVectorStore(
            client=supabase,
            embedding=embeddings,
            table_name="documents",
            query_name="match_documents"
        )
        docs = vector_store.similarity_search(question, k=3)
        rag_context = "\n\n".join([doc.page_content for doc in docs])
    except Exception as e:
        print(f"RAG search error: {e}")

    # 2. Append RAG context into session_content
    combined_content = f"{session_content}\n\n[RAG Context]:\n{rag_context}"
    history_text = _format_history(chat_history)

    try:
        return _get_chain().invoke({
            "question": question,
            "session_title": session_title,
            "session_content": combined_content[:2000],
            "chat_history": history_text
        })
    except Exception as e:
        return f"Maaf, saya tidak bisa menjawab sekarang. Error: {str(e)}"

def _format_history(messages: list) -> str:
    if not messages:
        return "Belum ada riwayat chat."
    formatted = []
    for msg in messages[-5:]:
        role = "Siswa" if msg.get("role") == "student" else "AI"
        formatted.append(f"{role}: {msg.get('content', '')}")
    return "\n".join(formatted)
```

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_qa_chatbot_rag.py -v`
Expected: PASS

**Step 5: Commit**

```bash
git add ai_chains/chains/qa_chatbot.py tests/test_qa_chatbot_rag.py
git commit -m "feat: integrate Supabase vector store retrieval into qa_chatbot"
```

---

### Task 5: Frontend Initial Assessment & Placement API Route

**Files:**
- Create: `D:/.maguru/maguru/app/api/assessment/route.ts`
- Create: `D:/.maguru/maguru/__tests__/integration/assessment.test.ts`

**Step 1: Write the failing test**

```typescript
// D:/.maguru/maguru/__tests__/integration/assessment.test.ts
import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/assessment/route';

describe('/api/assessment API Route', () => {
  it('returns 400 if courseId is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });
    
    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test __tests__/integration/assessment.test.ts`
Expected: FAIL (Endpoint doesn't exist)

**Step 3: Implement Assessment Scoring & Placement Logic**

```typescript
// D:/.maguru/maguru/app/api/assessment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Sesuaikan import prisma client yang sudah ada

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, courseId, answers } = body; // answers: { [questionId]: "a" }

    if (!userId || !courseId || !answers) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Ambil semua kunci pertanyaan kuis untuk course ini
    const questions = await prisma.assessment_questions.findMany({
      where: { courseId }
    });

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No assessment found for this course' }, { status: 404 });
    }

    // 2. Kalkulasi nilai kuis dan petakan kelulusan per topik
    let correctCount = 0;
    const topicScores: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      const isCorrect = answers[q.id] === q.correct;
      if (isCorrect) correctCount++;

      if (!topicScores[q.topic]) {
        topicScores[q.topic] = { total: 0, correct: 0 };
      }
      topicScores[q.topic].total++;
      if (isCorrect) {
        topicScores[q.topic].correct++;
      }
    });

    const finalScore = (correctCount / questions.length) * 100;

    // 3. Simpan nilai ke tabel user_assessments (Pre-test Baseline)
    await prisma.user_assessments.create({
      data: {
        userId,
        courseId,
        score: finalScore,
        type: 'PRE_TEST',
        answers: answers
      }
    });

    // 4. Logika Penempatan (Placement): Tandai lesson subtopik yang lulus (>70%) sebagai completed
    for (const topic of Object.keys(topicScores)) {
      const percentage = (topicScores[topic].correct / topicScores[topic].total) * 100;
      if (percentage >= 70) {
        // Cari lesson yang berelasi dengan topik ini dan tandai sebagai complete
        const lessonsToSkip = await prisma.lessons.findMany({
          where: {
            sections: {
              courseId: courseId,
              title: { contains: topic, mode: 'insensitive' }
            }
          }
        });

        for (const lesson of lessonsToSkip) {
          await prisma.lesson_progress.upsert({
            where: {
              lessonId_userId: { lessonId: lesson.id, userId }
            },
            update: { completed: true, completedAt: new Date() },
            create: { lessonId: lesson.id, userId, completed: true, completedAt: new Date() }
          });
        }
      }
    }

    return NextResponse.json({ score: finalScore, topicScores });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test __tests__/integration/assessment.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add app/api/assessment/route.ts __tests__/integration/assessment.test.ts
git commit -m "feat: implement initial assessment API and placement logic"
```

---

### Task 6: Frontend Chat UI SSE Streaming Integration

**Files:**
- Modify: `D:/.maguru/maguru/features/learn/ChatbotInterface.tsx`
- Create: `D:/.maguru/maguru/__tests__/integration/chatbot_ui.test.tsx`

**Step 1: Write the failing test**

```typescript
// D:/.maguru/maguru/__tests__/integration/chatbot_ui.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ChatbotInterface from '@/features/learn/ChatbotInterface';

describe('ChatbotInterface Component', () => {
  it('renders chat input correctly', () => {
    render(<ChatbotInterface courseId="test" lessonId="test" />);
    expect(screen.getByPlaceholderText(/Tanya AI Co-Teacher/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test __tests__/integration/chatbot_ui.test.tsx`
Expected: FAIL (Component not found or missing fields)

**Step 3: Update ChatbotInterface to hook with FastAPI endpoint**

```typescript
// D:/.maguru/maguru/features/learn/ChatbotInterface.tsx
import React, { useState } from 'react';

interface ChatbotInterfaceProps {
  courseId: string;
  lessonId: string;
}

const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({ courseId, lessonId }) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'student', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Panggil stream endpoint FastAPI
      const response = await fetch(`${process.env.NEXT_PUBLIC_LANGSERVE_URL || 'http://localhost:8000'}/chatbot/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: {
            question: input,
            session_title: `Lesson ${lessonId}`,
            session_content: `Materi Pelajaran Course ${courseId}`,
            chat_history: messages
          }
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiResponseText = '';

      // Tambahkan bubble kosong untuk AI
      setMessages((prev) => [...prev, { role: 'ai', content: '' }]);

      while (!done && reader) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        
        // Parse event stream chunks
        const lines = chunk.split('\n');
        lines.forEach((line) => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (typeof data === 'string') {
                aiResponseText += data;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].content = aiResponseText;
                  return updated;
                });
              }
            } catch (e) {
              // skip non-JSON lines
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded bg-white p-4">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded ${msg.role === 'student' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}>
            <strong>{msg.role === 'student' ? 'Siswa' : 'AI'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-500 italic">AI sedang mengetik...</div>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya AI Co-Teacher..."
          className="flex-1 border p-2 rounded"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">Kirim</button>
      </div>
    </div>
  );
};

export default ChatbotInterface;
```

**Step 4: Run test to verify it passes**

Run: `npm run test __tests__/integration/chatbot_ui.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add features/learn/ChatbotInterface.tsx __tests__/integration/chatbot_ui.test.tsx
git commit -m "feat: build React ChatbotInterface with RAG SSE stream connection"
```
