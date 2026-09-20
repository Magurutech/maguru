## Error Type
Console Error

## Error Message
flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.


    at LessonEditorPanel (features/cms/components/creator/manage/panels/LessonEditorPanel.tsx:644:13)
    at ManageContent (features/cms/components/creator/manage/ManageContent.tsx:17:12)
    at ManagePageInner (app/creator/courses/[slug]/manage/page.tsx:71:11)
    at CourseManagePage (app/creator/courses/[slug]/manage/page.tsx:86:7)

## Code Frame
  642 |             onClick={() => editor?.commands.focus()}
  643 |           >
> 644 |             <EditorContent
      |             ^
  645 |               editor={editor}
  646 |               role="presentation"
  647 |               className="simple-editor-content max-w-full [&_.tiptap]:min-h-[250px] [&_.tiptap]:px-0 [&_.tiptap.ProseMirror.simple-editor]:pb-8 text-text-secondary text-sm md:text-base font-sans leading-relaxed"

Next.js version: 16.1.6 (Turbopack)
