[Supabase Server Auth] Resolved user from proxy forwarded headers: e6dcde47-5260-4ff2-9aac-a66e408663a4
 GET /api/courses/modul-awal-python 200 in 777ms (compile: 164ms, proxy.ts: 480ms, render: 133ms)
 GET /api/progress/course/modul-awal-python 200 in 958ms (compile: 157ms, proxy.ts: 356ms, render: 445ms)
[Proxy Auth] Forwarded verified user e6dcde47-5260-4ff2-9aac-a66e408663a4 to GET /api/courses/modul-awal-python
 GET /api/courses/modul-awal-python 200 in 357ms (compile: 16ms, proxy.ts: 161ms, render: 180ms)
 GET /api/courses/modul-awal-python/sections/81d46e3c-d084-4b32-96ad-eaeb020f710c/lessons/0f11a69b-76d6-4400-bea1-a0c5a83d9827 200 in 1942ms (compile: 260ms, proxy.ts: 452ms, render: 1230ms)
 GET /api/assessment/questions?courseId=modul-awal-python 200 in 2.3s (compile: 105ms, proxy.ts: 483ms, render: 1710ms)
[Proxy Auth] Forwarded verified user e6dcde47-5260-4ff2-9aac-a66e408663a4 to GET /api/assessment/questions
[Supabase Server Auth] Resolved user from proxy forwarded headers: e6dcde47-5260-4ff2-9aac-a66e408663a4
 GET /api/assessment/questions?courseId=modul-awal-python 200 in 569ms (compile: 38ms, proxy.ts: 203ms, render: 328ms)
[Proxy Auth] Forwarded verified user e6dcde47-5260-4ff2-9aac-a66e408663a4 to POST /api/assessment/submit
[Supabase Server Auth] Resolved user from proxy forwarded headers: e6dcde47-5260-4ff2-9aac-a66e408663a4
[Assessment Scoring Engine] 🎯 Score Calculation Audit
  📊 Summary: 12/15 Correct (80%)
  ┌─────────┬────┬──────────────┬───────────────────────────────────────┬────────────────┬────────────────┬──────────────┐
  │ (index) │ #  │ Question ID  │ Topic                                 │ Student Answer │ Correct Answer │ Result       │
  ├─────────┼────┼──────────────┼───────────────────────────────────────┼────────────────┼────────────────┼──────────────┤
  │ 0       │ 1  │ 'cmu326jgf0' │ 'Algoritma Pencarian & Alur Eksekusi' │ 'a'            │ 'A'           
 │ '✅ CORRECT' │
  │ 1       │ 2  │ 'cmtqmi1lm0' │ 'Arsitektur Cloud & Skalabilitas'     │ 'b'            │ 'B'           
 │ '✅ CORRECT' │
  │ 2       │ 3  │ 'cmu326jvs0' │ 'Bug Hunting & Logic Error'           │ 'a'            │ 'A'           
 │ '✅ CORRECT' │
  │ 3       │ 4  │ 'cmu32964h0' │ 'Caching & Strategi Penyimpanan'      │ 'b'            │ 'B'           
 │ '✅ CORRECT' │
  │ 4       │ 5  │ 'cmu3297mv0' │ 'Desain API & Penanganan Halaman'     │ 'c'            │ 'C'           
 │ '✅ CORRECT' │
  │ 5       │ 6  │ 'cmu326irs0' │ 'Error Handling & Defensive Coding'   │ 'a'            │ 'A'           
 │ '✅ CORRECT' │
  │ 6       │ 7  │ 'cmtqmi2fq0' │ 'JavaScript Array Methods'            │ 'a'            │ 'B'           
 │ '❌ WRONG'   │
  │ 7       │ 8  │ 'cmtqmi3cu0' │ 'Keamanan Web & Autentikasi'          │ 'c'            │ 'C'           
 │ '✅ CORRECT' │
  │ 8       │ 9  │ 'cmu326hu60' │ 'Konsep Inti (Pengenalan Python)'     │ 'd'            │ 'A'           
 │ '❌ WRONG'   │
  │ 9       │ 10 │ 'cmu32981t0' │ 'Konsep Inti (Pengenalan Python)'     │ 'a'            │ 'A'           
 │ '✅ CORRECT' │
  │ 10      │ 11 │ 'cmu3297930' │ 'Manipulasi Daftar & Set'             │ 'b'            │ 'B'           
 │ '✅ CORRECT' │
  │ 11      │ 12 │ 'cmu326iae0' │ 'Penanganan Tipe Data & Filtering'    │ 'c'            │ 'A'           
 │ '❌ WRONG'   │
  │ 12      │ 13 │ 'cmtqmi47r0' │ 'SQL & Basis Data'                    │ 'b'            │ 'B'           
 │ '✅ CORRECT' │
  │ 13      │ 14 │ 'cmu3296su0' │ 'Struktur Data & Kompleksitas'        │ 'a'            │ 'A'           
 │ '✅ CORRECT' │
  │ 14      │ 15 │ 'cmtqmi0pj0' │ 'Tipe Data & Penanganan Error'        │ 'b'            │ 'B'           
 │ '✅ CORRECT' │
  └─────────┴────┴──────────────┴───────────────────────────────────────┴────────────────┴────────────────┴──────────────┘
  📌 Topic Breakdown: {
    'Algoritma Pencarian & Alur Eksekusi': { correct: 1, total: 1, percentage: 100 },
    'Arsitektur Cloud & Skalabilitas': { correct: 1, total: 1, percentage: 100 },
    'Bug Hunting & Logic Error': { correct: 1, total: 1, percentage: 100 },
    'Caching & Strategi Penyimpanan': { correct: 1, total: 1, percentage: 100 },
    'Desain API & Penanganan Halaman': { correct: 1, total: 1, percentage: 100 },
    'Error Handling & Defensive Coding': { correct: 1, total: 1, percentage: 100 },
    'JavaScript Array Methods': { correct: 0, total: 1, percentage: 0 },
    'Keamanan Web & Autentikasi': { correct: 1, total: 1, percentage: 100 },
    'Konsep Inti (Pengenalan Python)': { correct: 1, total: 2, percentage: 50 },
    'Manipulasi Daftar & Set': { correct: 1, total: 1, percentage: 100 },
    'Penanganan Tipe Data & Filtering': { correct: 0, total: 1, percentage: 0 },
    'SQL & Basis Data': { correct: 1, total: 1, percentage: 100 },
    'Struktur Data & Kompleksitas': { correct: 1, total: 1, percentage: 100 },
    'Tipe Data & Penanganan Error': { correct: 1, total: 1, percentage: 100 }
  }
 POST /api/assessment/submit 200 in 5.3s (compile: 1576ms, proxy.ts: 949ms, render: 2.7s)
[Proxy Auth] Forwarded verified user e6dcde47-5260-4ff2-9aac-a66e408663a4 to GET /api/progress/course/modul-awal-python
[Proxy Auth] Forwarded verified user e6dcde47-5260-4ff2-9aac-a66e408663a4 to GET /api/progress/course/modul-awal-python/lessons
[Supabase Server Auth] Resolved user from proxy forwarded headers: e6dcde47-5260-4ff2-9aac-a66e408663a4
[Supabase Server Auth] Resolved user from proxy forwarded headers: e6dcde47-5260-4ff2-9aac-a66e408663a4
[Proxy Auth] Forwarded verified user e6dcde47-5260-4ff2-9aac-a66e408663a4 to GET /api/courses/modul-awal-python/sections
 GET /api/progress/course/modul-awal-python/lessons 200 in 1618ms (compile: 150ms, proxy.ts: 714ms, render: 754ms)
[Supabase Server Auth] Resolved user from proxy forwarded headers: e6dcde47-5260-4ff2-9aac-a66e408663a4
 GET /api/courses/modul-awal-python/sections?include=lessons 200 in 1982ms (compile: 38ms, proxy.ts: 934ms, render: 1010ms)
 GET /api/progress/course/modul-awal-python 200 in 2.2s (compile: 62ms, proxy.ts: 723ms, render: 1404ms)
[Proxy Auth] Forwarded verified user e6dcde47-5260-4ff2-9aac-a66e408663a4 to GET /api/courses/modul-awal-python
 GET /api/courses/modul-awal-python 200 in 357ms (compile: 59ms, proxy.ts: 159ms, render: 140ms)
[Proxy Auth] Forwarded verified user e6dcde47-5260-4ff2-9aac-a66e408663a4 to GET /api/courses/modul-awal-python
 GET /api/courses/modul-awal-python 200 in 761ms (compile: 25ms, proxy.ts: 618ms, render: 117ms)
[Proxy Auth] Forwarded verified user e6dcde47-5260-4ff2-9aac-a66e408663a4 to GET /api/assessment/results
[Supabase Server Auth] Resolved user from proxy forwarded headers: e6dcde47-5260-4ff2-9aac-a66e408663a4
[Assessment Scoring Engine] 🎯 Score Calculation Audit
  📊 Summary: 12/15 Correct (80%)
  ┌─────────┬────┬──────────────┬───────────────────────────────────────┬────────────────┬────────────────┬──────────────┐
  │ (index) │ #  │ Question ID  │ Topic                                 │ Student Answer │ Correct Answer │ Result       │
  ├─────────┼────┼──────────────┼───────────────────────────────────────┼────────────────┼────────────────┼──────────────┤
  │ 0       │ 1  │ 'cmu326jgf0' │ 'Algoritma Pencarian & Alur Eksekusi' │ 'a'            │ 'A'           
 │ '✅ CORRECT' │
  │ 1       │ 2  │ 'cmtqmi1lm0' │ 'Arsitektur Cloud & Skalabilitas'     │ 'b'            │ 'B'           
 │ '✅ CORRECT' │
  │ 2       │ 3  │ 'cmu326jvs0' │ 'Bug Hunting & Logic Error'           │ 'a'            │ 'A'           
 │ '✅ CORRECT' │
  │ 3       │ 4  │ 'cmu32964h0' │ 'Caching & Strategi Penyimpanan'      │ 'b'            │ 'B'           
 │ '✅ CORRECT' │
  │ 4       │ 5  │ 'cmu3297mv0' │ 'Desain API & Penanganan Halaman'     │ 'c'            │ 'C'           
 │ '✅ CORRECT' │
  │ 5       │ 6  │ 'cmu326irs0' │ 'Error Handling & Defensive Coding'   │ 'a'            │ 'A'           
 │ '✅ CORRECT' │
  │ 6       │ 7  │ 'cmtqmi2fq0' │ 'JavaScript Array Methods'            │ 'a'            │ 'B'           
 │ '❌ WRONG'   │
  │ 7       │ 8  │ 'cmtqmi3cu0' │ 'Keamanan Web & Autentikasi'          │ 'c'            │ 'C'           
 │ '✅ CORRECT' │
  │ 8       │ 9  │ 'cmu326hu60' │ 'Konsep Inti (Pengenalan Python)'     │ 'd'            │ 'A'           
 │ '❌ WRONG'   │
  │ 9       │ 10 │ 'cmu32981t0' │ 'Konsep Inti (Pengenalan Python)'     │ 'a'            │ 'A'           
 │ '✅ CORRECT' │
  │ 10      │ 11 │ 'cmu3297930' │ 'Manipulasi Daftar & Set'             │ 'b'            │ 'B'           
 │ '✅ CORRECT' │
  │ 11      │ 12 │ 'cmu326iae0' │ 'Penanganan Tipe Data & Filtering'    │ 'c'            │ 'A'           
 │ '❌ WRONG'   │
  │ 12      │ 13 │ 'cmtqmi47r0' │ 'SQL & Basis Data'                    │ 'b'            │ 'B'           
 │ '✅ CORRECT' │
  │ 13      │ 14 │ 'cmu3296su0' │ 'Struktur Data & Kompleksitas'        │ 'a'            │ 'A'           
 │ '✅ CORRECT' │
  │ 14      │ 15 │ 'cmtqmi0pj0' │ 'Tipe Data & Penanganan Error'        │ 'b'            │ 'B'           
 │ '✅ CORRECT' │
  └─────────┴────┴──────────────┴───────────────────────────────────────┴────────────────┴────────────────┴──────────────┘
  📌 Topic Breakdown: {
    'Algoritma Pencarian & Alur Eksekusi': { correct: 1, total: 1, percentage: 100 },
    'Arsitektur Cloud & Skalabilitas': { correct: 1, total: 1, percentage: 100 },
    'Bug Hunting & Logic Error': { correct: 1, total: 1, percentage: 100 },
    'Caching & Strategi Penyimpanan': { correct: 1, total: 1, percentage: 100 },
    'Desain API & Penanganan Halaman': { correct: 1, total: 1, percentage: 100 },
    'Error Handling & Defensive Coding': { correct: 1, total: 1, percentage: 100 },
    'JavaScript Array Methods': { correct: 0, total: 1, percentage: 0 },
    'Keamanan Web & Autentikasi': { correct: 1, total: 1, percentage: 100 },
    'Konsep Inti (Pengenalan Python)': { correct: 1, total: 2, percentage: 50 },
    'Manipulasi Daftar & Set': { correct: 1, total: 1, percentage: 100 },
    'Penanganan Tipe Data & Filtering': { correct: 0, total: 1, percentage: 0 },
    'SQL & Basis Data': { correct: 1, total: 1, percentage: 100 },
    'Struktur Data & Kompleksitas': { correct: 1, total: 1, percentage: 100 },
    'Tipe Data & Penanganan Error': { correct: 1, total: 1, percentage: 100 }
  }
 GET /api/assessment/results?courseId=modul-awal-python 200 in 2.8s (compile: 1711ms, proxy.ts: 506ms, render: 581ms)
