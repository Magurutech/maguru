## Error Type
Console ReferenceError

## Error Message
useEffect is not defined


    at useLessonLearn (features/cms/hooks/learn/useLessonLearn.ts:47:3)
    at LearnProvider (features/cms/context/student/LearnContext.tsx:71:21)
    at S.scheduleRefresh (chrome-extension://fmkadmapgofadopljbjfkapdkoienihi/build/installHook.js:1:86461)
    at UserRoleProvider (features/auth/context/UserRoleContext.tsx:353:5)
    at RootLayout (app\layout.tsx:45:11)

## Code Frame
  45 |
  46 |   // Pre-populate lessonsMap from sections data (fetched with ?include=lessons)
> 47 |   useEffect(() => {
     |   ^
  48 |     const initialLessonsMap: Record<string, LearnLesson[]> = {}
  49 |     const initialExpandedSections = new Set<string>()
  50 |

Next.js version: 16.1.6 (Turbopack)
