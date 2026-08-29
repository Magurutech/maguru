INFO:     127.0.0.1:58813 - "OPTIONS /chatbot/stream HTTP/1.1" 200 OK
INFO:     127.0.0.1:58813 - "POST /chatbot/stream HTTP/1.1" 200 OK
INFO:app.chains.qa_chatbot:[BACKEND_QA][INPUT_RECEIVED] ThreadID: 'session-1787970166225-k4qqe' | Co
                                                                                 ourse: 'test-course-double-postman-dari-postman' | Session: 'Pengenalan Python' | Question: 'haloo ai...'
WARNING:app.db.vector_store:DATABASE_URL is not set. PGVector store will be unavailable.
INFO:app.chains.qa_chatbot:[BACKEND_QA][RAG_LOOKUP] Retrieved 0 chars of context for course 'test-course-double-postman-dari-postman'
INFO:app.chains.qa_chatbot:[BACKEND_QA][PIPELINE_READY] Preprocessing completed in 3.0ms. Dispatching to LLM Stream...
INFO:httpx:HTTP Request: POST https://openrouter.ai/api/v1/chat/completions "HTTP/1.1 200 OK"
INFO:     127.0.0.1:55618 - "POST /chatbot/stream HTTP/1.1" 200 OK
INFO:app.chains.qa_chatbot:[BACKEND_QA][INPUT_RECEIVED] ThreadID: 'session-1787970166225-k4qqe' | Course: 'test-course-double-postman-dari-postman' | Session: 'Pengenalan Python' | Question: 'biskaha kamu jelaskan terkait apa yang sedanag kita pelajari...'
WARNING:app.db.vector_store:DATABASE_URL is not set. PGVector store will be unavailable.
INFO:app.chains.qa_chatbot:[BACKEND_QA][RAG_LOOKUP] Retrieved 0 chars of context for course 'test-course-double-postman-dari-postman'
INFO:app.chains.qa_chatbot:[BACKEND_QA][PIPELINE_READY] Preprocessing completed in 5.9ms. Dispatching to LLM Stream...
INFO:httpx:HTTP Request: POST https://openrouter.ai/api/v1/chat/completions "HTTP/1.1 200 OK"
INFO:     127.0.0.1:62414 - "POST /chatbot/stream HTTP/1.1" 200 OK
INFO:app.chains.qa_chatbot:[BACKEND_QA][INPUT_RECEIVED] ThreadID: 'session-1787970166225-k4qqe' | Course: 'test-course-double-postman-dari-postman' | Session: 'Pengenalan Python' | Question: 'sepertinya saya kesusuahan untuk emmahaminya , bisakha kamu ...'
WARNING:app.db.vector_store:DATABASE_URL is not set. PGVector store will be unavailable.
INFO:app.chains.qa_chatbot:[BACKEND_QA][RAG_LOOKUP] Retrieved 0 chars of context for course 'test-course-double-postman-dari-postman'
INFO:app.chains.qa_chatbot:[BACKEND_QA][PIPELINE_READY] Preprocessing completed in 3.3ms. Dispatching to LLM Stream...
INFO:httpx:HTTP Request: POST https://openrouter.ai/api/v1/chat/completions "HTTP/1.1 200 OK"



2026-08-29T03:23:22.641Z [INFO] [useChatbot][sendMessage] ✅ [FRONTEND_CHAT] Stream Completed (872 chunks, 4089 chars in 25026ms){  "totalChunks": 872,  "totalChars": 4089,  "durationMs": 25026,  "performance": {    "timestamp": 1787973802641,    "memory": null  }}
forward-logs-shared.ts:95 [Fast Refresh] rebuilding
forward-logs-shared.ts:95 [Fast Refresh] done in 846ms
forward-logs-shared.ts:95 [Fast Refresh] rebuilding