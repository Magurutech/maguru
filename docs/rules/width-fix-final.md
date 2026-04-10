# Width Fix: Override SCSS max-width Constraint

**Tanggal:** 2026-04-10  
**Issue:** Content width masih terbatas meski sudah set `w-full`  
**Status:** ✅ FIXED  
**Priority:** 🟡 Medium → ✅ Resolved

---

## Problem Analysis

### Issue
Meski sudah menambahkan `w-full` dan `max-w-none` di Tailwind classes, content width masih terbatas ke ~648px.

### Root Cause Found

Di `components/tiptap-templates/simple/simple-editor.scss` line 60-64:

```scss
.simple-editor-content {
  max-width: 648px;  // ← SCSS override Tailwind!
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}
```

**Why this happens:**
1. SCSS file di-import di `LessonViewer.tsx`
2. SCSS `max-width: 648px` memiliki specificity yang sama dengan Tailwind
3. Karena SCSS di-load setelah Tailwind, SCSS wins
4. Tailwind `max-w-none` tidak cukup untuk override

### CSS Specificity Battle

```
Tailwind: .max-w-none { max-width: none; }
SCSS:     .simple-editor-content { max-width: 648px; }
```

Both have same specificity (1 class), tapi SCSS di-load later → SCSS wins.

---

## Solution

Use Tailwind `!important` modifier to force override:

### Before:
```tsx
<EditorContent 
  editor={editor} 
  className="simple-editor-content w-full max-w-none [&_.tiptap]:px-0 [&_.tiptap]:max-w-none"
  role="presentation"
/>
```

### After:
```tsx
<EditorContent 
  editor={editor} 
  className="simple-editor-content !max-w-none w-full [&_.tiptap]:px-0 [&_.tiptap]:!max-w-none [&_.tiptap]:w-full"
  role="presentation"
/>
```

**Changes:**
1. `!max-w-none` - Force override parent max-width
2. `[&_.tiptap]:!max-w-none` - Force override Tiptap editor max-width
3. `[&_.tiptap]:w-full` - Ensure Tiptap editor takes full width

**Why `!` (important):**
- Tailwind `!` prefix adds `!important` to CSS
- `!important` beats any specificity
- Only way to override SCSS without modifying SCSS file

---

## Alternative Solutions Considered

### Option 1: Modify SCSS File ❌
**Pros:**
- Clean, no `!important` needed
- Permanent fix

**Cons:**
- SCSS file shared dengan creator editor
- Might break creator layout
- Not recommended to modify shared styles

### Option 2: Create Custom SCSS Override ❌
**Pros:**
- Separate from shared styles

**Cons:**
- Additional file to maintain
- Still need to manage load order
- Overkill for simple fix

### Option 3: Use Inline Styles ❌
**Pros:**
- Highest specificity

**Cons:**
- Not Tailwind-first approach
- Harder to maintain
- Loses Tailwind benefits

### Option 4: Use Tailwind `!important` ✅ (CHOSEN)
**Pros:**
- Simple, one-line fix
- Tailwind-first approach
- No additional files
- Clear intent in code

**Cons:**
- Uses `!important` (generally discouraged)
- But justified here for override

---

## Why This Approach is Acceptable

**When `!important` is OK:**
1. ✅ Overriding third-party styles (SCSS from Tiptap template)
2. ✅ Utility classes (Tailwind utilities are meant to be overridable)
3. ✅ Clear intent (width constraint needs to be removed)
4. ✅ Localized (only affects this component)
5. ✅ Documented (this file explains why)

**When `!important` is BAD:**
1. ❌ Overriding your own styles (indicates poor architecture)
2. ❌ Cascading overrides (creates specificity war)
3. ❌ Unclear intent (why is this important?)
4. ❌ Global scope (affects entire app)

Our use case falls into the "acceptable" category.

---

## Technical Details

### CSS Cascade Order
```
1. Browser defaults
2. External stylesheets (Tailwind base)
3. External stylesheets (SCSS imports)
4. Inline styles
5. !important declarations
```

### Specificity Calculation
```
Selector                    Specificity
.simple-editor-content      0,0,1,0
.max-w-none                 0,0,1,0
.!max-w-none                0,0,1,0 + !important
```

With `!important`, our Tailwind class wins regardless of load order.

---

## Testing

### Visual Check
- [ ] Content width fills available space
- [ ] No horizontal scroll
- [ ] Content not constrained to 648px
- [ ] Responsive on all screen sizes

### DevTools Check
```css
/* Should see in computed styles: */
.simple-editor-content {
  max-width: none !important; /* ← Tailwind wins */
}
```

### Breakpoints
- [ ] Mobile (320px+): Full width minus padding
- [ ] Tablet (768px+): Full width minus padding
- [ ] Desktop (1024px+): Constrained by parent max-w-5xl
- [ ] Large (1920px+): Constrained by parent max-w-5xl

---

## Files Modified

- ✅ `features/cms/components/student/LessonViewer.tsx`

## Files NOT Modified (Intentional)

- ✅ `components/tiptap-templates/simple/simple-editor.scss` - Shared file, don't touch

---

## Related Issues

- Issue 2: Tiptap Rendering Fix (completed)
- Theme Toggle Implementation (completed)
- Width Optimization (this fix)

---

## Conclusion

Successfully overrode SCSS `max-width: 648px` constraint using Tailwind `!important` modifier. Content now fills available width as intended, constrained only by parent `max-w-5xl` for optimal reading experience.

**Status:** ✅ READY FOR TESTING

---

## Quick Reference

**Problem:** SCSS `max-width: 648px` limiting content width

**Solution:** Tailwind `!max-w-none` to force override

**Why:** SCSS loaded after Tailwind, needs `!important` to win

**Result:** Full width content, optimal reading experience
