## Error Type
Console ReferenceError

## Error Message
useRef is not defined


    at ManageProvider (features/cms/Context/creator/ManageContext.tsx:92:21)
    at UserRoleProvider (features/auth/context/UserRoleContext.tsx:353:5)
    at ManageLayout (app\creator\courses\[slug]\manage\layout.tsx:7:5)

## Code Frame
  90 |   // ── Editor ref — registered by LessonEditorPanel ─────────────────────────
  91 |   // EditorToolbarStrip at page level reads this via EditorContext.Provider below
> 92 |   const editorRef = useRef<Editor | null>(null)
     |                     ^
  93 |
  94 |   // ── Delete section confirmation ──────────────────────────────────────────
  95 |   const [pendingDeleteSectionId, setPendingDeleteSectionId] = useState<string | null>(null)

Next.js version: 16.1.6 (Turbopack)
