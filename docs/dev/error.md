## Error Type
Console Error

## Error Message
flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.


    at LessonViewerPanel (features/cms/components/creator/manage/panels/LessonViewerPanel.tsx:171:9)
    at ManageContent (features/cms/components/creator/manage/ManageContent.tsx:45:9)
    at ManagePageInner (app/creator/courses/[slug]/manage/page.tsx:71:11)
    at CourseManagePage (app/creator/courses/[slug]/manage/page.tsx:86:7)

## Code Frame
  169 |
  170 |       <div className="lesson-editor-body">
> 171 |         <EditorContent
      |         ^
  172 |           editor={editor}
  173 |           role="presentation"
  174 |           className="simple-editor-content max-w-full [&_.simple-editor-content]:h-auto [&_.tiptap]:px-0 [&_.tiptap.ProseMirror.simple-editor]:pb-4 [&_.tiptap.ProseMirror.simple-editor]:pt-0 text-text-secondary leading-relaxed text-sm font-sans"

Next.js version: 16.1.6 (Turbopack)

[Fast Refresh] done in 480ms
forward-logs-shared.ts:95 [Fast Refresh] rebuilding
forward-logs-shared.ts:95 [Fast Refresh] done in 380ms
3installHook.js:1 flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.
overrideMethod @ installHook.js:1
3installHook.js:1 flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.
overrideMethod @ installHook.js:1
forward-logs-shared.ts:95 [Fast Refresh] rebuilding
