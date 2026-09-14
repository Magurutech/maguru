LANGSERVE: See all available routes at /docs/
INFO:     Application startup complete.
INFO:app.chains.quiz_generator:[QUIZ_GEN][DISPATCH] Generating 5 'medium' questions with style 'balanced' for course '7ab9ce59-7acf-4eff-887c-4184cfb30d58' (content len: 167)
INFO:httpx:HTTP Request: POST https://openrouter.ai/api/v1/chat/completions "HTTP/1.1 200 OK"
INFO:app.chains.quiz_generator:[QUIZ_GEN][RESPONSE] Received raw LLM response (3257 chars)
INFO:app.chains.quiz_generator:[QUIZ_GEN][EXTRACT] Raw text length: 3257 chars
WARNING:app.chains.quiz_generator:[QUIZ_GEN][JSON_PARSE_WARN] Direct array loads failed: Unterminated string starting at: line 59 column 12 (char 3150). Attempting individual object extraction.
INFO:app.chains.quiz_generator:[QUIZ_GEN][RECOVERED] Successfully extracted 2 question objects via balanced scanner
INFO:app.chains.quiz_generator:[QUIZ_GEN][SUCCESS] Validated 2 questions with full options and explanations
INFO:     127.0.0.1:55005 - "POST /api/v1/generate-quiz HTTP/1.1" 200 OK
INFO:     127.0.0.1:60451 - "OPTIONS /api/v1/generate-quiz HTTP/1.1" 200 OK
INFO:app.chains.quiz_generator:[QUIZ_GEN][DISPATCH] Generating 5 'medium' questions with style 'balanced' for course '7ab9ce59-7acf-4eff-887c-4184cfb30d58' (content len: 75)
INFO:httpx:HTTP Request: POST https://openrouter.ai/api/v1/chat/completions "HTTP/1.1 200 OK"
INFO:app.chains.quiz_generator:[QUIZ_GEN][RESPONSE] Received raw LLM response (0 chars)
ERROR:app.chains.quiz_generator:[QUIZ_GEN][ERROR] Error generating quiz questions: Raw LLM output is completely empty
Traceback (most recent call last):
  File "D:\.maguru\maguru-model\app\chains\quiz_generator.py", line 413, in generate_quiz_questions
    questions = _extract_json_array(raw_output, default_diff=safe_difficulty)
                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "D:\.maguru\maguru-model\app\chains\quiz_generator.py", line 307, in _extract_json_array 
    raise ValueError("Raw LLM output is completely empty")
ValueError: Raw LLM output is completely empty
INFO:     127.0.0.1:60451 - "POST /api/v1/generate-quiz HTTP/1.1" 200 OK



[AI Quiz Generator] 🚀 Dispatching request: 
Object
forward-logs-shared.ts:95 [AI Quiz Generator] ✅ Received 1 questions (74610ms)
forward-logs-shared.ts:95 📌 Full Payload: 
Array(1)
forward-logs-shared.ts:95 
Array(1)
0
: 
#
: 
1
Ada Pembahasan?
: 
"Ya"
Hints
: 
"-"
Kunci
: 
"A"
Micro-Skill
: 
"general"
Opsi A
: 
"Pemrograman memerlukan pe"
Opsi B
: 
"Semua variabel tidak meme"
Opsi C
: 
"Bahasa pemrograman tidak "
Opsi D
: 
"Tipe data string hanya bo"
Pertanyaan
: 
"Manakah dari pernyataan berikut yang paling tepat mengenai m..."
Tingkat
: 
"medium"
Topik
: 
"Konsep Pemrograman"
[[Prototype]]
: 
Object
length
: 
1
[[Prototype]]
: 
Array(0)