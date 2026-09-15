INFO:     127.0.0.1:49775 - "OPTIONS /api/v1/generate-quiz HTTP/1.1" 200 OK
INFO:app.chains.quiz_generator:[QUIZ_GEN][DISPATCH] Generating 5 'medium' questions with style 'balanced' for topic 'Pengenalan Python' (content len: 128)
INFO:httpx:HTTP Request: POST https://openrouter.ai/api/v1/chat/completions "HTTP/1.1 200 OK"
INFO:app.chains.quiz_generator:[QUIZ_GEN][RESPONSE] Received raw LLM response (0 chars)
WARNING:app.chains.quiz_generator:[QUIZ_GEN][RETRY] Primary model returned empty/short output (0 chars). Iterating backup model pool...
INFO:app.chains.quiz_generator:[QUIZ_GEN][RETRY_ATTEMPT] Trying backup model: cohere/north-mini-code:free
INFO:httpx:HTTP Request: POST https://openrouter.ai/api/v1/chat/completions "HTTP/1.1 200 OK"
INFO:app.chains.quiz_generator:[QUIZ_GEN][RETRY_ATTEMPT] Trying backup model: minimax/minimax-m3:free
INFO:httpx:HTTP Request: POST https://openrouter.ai/api/v1/chat/completions "HTTP/1.1 404 Not Found"
WARNING:app.chains.quiz_generator:[QUIZ_GEN][MODEL_FAIL] Backup model 'minimax/minimax-m3:free' failed: Error code: 404 - {'error': {'message': 'This model is unavailable for free. The paid version is available now - use this slug instead: minimax/minimax-m3', 'code': 404}, 'user_id': 'user_2yj39fGOELlTlO6AcLdeMIYF93W'}
INFO:app.chains.quiz_generator:[QUIZ_GEN][FALLBACK_GEN] Generating 5 high-quality contextual fallback questions for 'Pengenalan Python'
INFO:     127.0.0.1:49775 - "POST /api/v1/generate-quiz HTTP/1.1" 200 OK
INFO:     127.0.0.1:54780 - "GET /api/v1/ingest/status?course_id=7ab9ce59-7acf-4eff-887c-4184cfb30d58 HTTP/1.1" 200 OK
INFO:app.chains.quiz_generator:[QUIZ_GEN][DISPATCH] Generating 5 'medium' questions with style 'balanced' for topic 'Pengenalan Python' (content len: 120)
INFO:httpx:HTTP Request: POST https://openrouter.ai/api/v1/chat/completions "HTTP/1.1 200 OK"
INFO:app.chains.quiz_generator:[QUIZ_GEN][RESPONSE] Received raw LLM response (6360 chars)
INFO:app.chains.quiz_generator:[QUIZ_GEN][EXTRACT] Raw text length: 6360 chars
WARNING:app.chains.quiz_generator:[QUIZ_GEN][JSON_PARSE_WARN] Direct array loads failed: Expecting ',' delimiter: line 39 column 286 (char 3042). Attempting individual object extraction.
INFO:app.chains.quiz_generator:[QUIZ_GEN][RECOVERED] Successfully extracted 4 question objects via balanced scanner
INFO:app.chains.quiz_generator:[QUIZ_GEN][SUCCESS] Validated 4 questions with full options and explanations
INFO:app.chains.quiz_generator:[QUIZ_GEN][PADDING] Supplementing 1 questions to fulfill requested 5 questions
INFO:     127.0.0.1:56058 - "POST /api/v1/generate-quiz HTTP/1.1" 200 OK
