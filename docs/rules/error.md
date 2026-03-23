body/json 
{
  "title": "Intro to TypeScript",
  "order": 1,
  "content": {
    "type": "doc",
    "version": 1,
    "lastEdit": "2026-03-19T00:00:00.000Z",
    "content": [
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Hello world" }]
      }
    ]
  }
}

Hasil 


{
    "error": "Invalid lesson content: [\n  {\n    \"expected\": \"object\",\n    \"code\": \"invalid_type\",\n    \"path\": [\n      \"content\"\n    ],\n    \"message\": \"Invalid input: expected object, received array\"\n  }\n]",
    "code": "VALIDATION_ERROR"
}


 POST /api/courses/test-course-double-postman-dari-postman/sections/4b2637a9-1133-4612-a0a6-5863d37a840d%22/lessons 404 in 522ms (compile: 175ms, proxy.ts: 60ms, render: 288ms)
Error creating lesson: Error: Invalid lesson content: [
  {
    "expected": "object",
    "code": "invalid_type",
    "path": [
      "content"
    ],
    "message": "Invalid input: expected object, received array"
  }
]
    at LessonService.createLesson (features\cms\services\lesson.service.ts:51:13)
    at POST (app\api\courses\[slug]\sections\[sectionId]\lessons\route.ts:67:40) 
  49 |       validateLessonContent(input.content)
  50 |     } catch (error) {
> 51 |       throw new Error(
     |             ^
  52 |         `Invalid lesson content: ${error instanceof Error ? error.message : 'Unknown error'}`
  53 |       )
  54 |     }
 POST /api/courses/test-course-double-postman-dari-postman/sections/4b2637a9-1133-4612-a0a6-5863d37a840d/lessons 400 in 2.6s (compile: 132ms, proxy.ts: 57ms, render: 2.4s)
