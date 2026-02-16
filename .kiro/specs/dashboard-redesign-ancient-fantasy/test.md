# Manual Testing Checklist - Dashboard Redesign

## Prerequisites
- [ ] Dev server running: `yarn app`
- [ ] Browser opened at `http://localhost:3000/dashboard`
- [ ] User logged in via Clerk

---

## 1. USER ROLE TESTING

### Stats Display
- [ ] "Kursus Diikuti" stat shows (beige/blue icon)
- [ ] "Kursus Selesai" stat shows (hijau/green icon)
- [ ] "Jam Belajar" stat shows (purple icon)
- [ ] "Sertifikat" stat shows (kuning/yellow icon)

### Recent Courses
- [ ] Course cards display with `.glass-panel-light` styling
- [ ] Progress bar shows correct percentage (hijau color)
- [ ] "Lanjut" button for incomplete courses (< 100%)
- [ ] "Review" button for completed courses (= 100%)
- [ ] Instructor name displays
- [ ] "Terakhir diakses" date displays

### Quick Actions
- [ ] "Jelajahi Kursus Baru" button
- [ ] "Edit Profil" button
- [ ] "Lihat Sertifikat" button
- [ ] Buttons show `hover-glow` effect

### Recommendations
- [ ] Recommendation cards display (if courses taken)
- [ ] Cards show `hover-lift` effect
- [ ] Lightbulb icon visible
- [ ] Reasoning text shows

### Header
- [ ] Title: "Dashboard Learner"
- [ ] Greeting: "Halo, [firstName]"
- [ ] Role badge: "Learner" (User icon, beige color)

---

## 2. CREATOR ROLE TESTING

### Stats Display
- [ ] "Total Kursus" stat shows
- [ ] "Kursus Terbit" stat shows
- [ ] "Total Siswa" stat shows
- [ ] "Pendapatan Bulan Ini" stat shows

### Header
- [ ] Title: "Dashboard Creator"
- [ ] Role badge: "Creator" (Palette icon, kuning color)

### Quick Actions
- [ ] "Creator Studio" is FIRST action button
- [ ] Other user actions still present

---

## 3. ADMIN ROLE TESTING

### Stats Display
- [ ] "Kesehatan Sistem" stat shows
- [ ] "Pengguna Aktif" stat shows
- [ ] "Total Pendapatan" stat shows
- [ ] "Isu Platform" stat shows

### Header
- [ ] Title: "Dashboard Admin"
- [ ] Role badge: "Admin" (Shield icon, merah color)

### Quick Actions
- [ ] "Admin Panel" is FIRST action button

---

## 4. RESPONSIVE LAYOUT

### Mobile (< 768px)
- [ ] Stats grid: 1 column
- [ ] Quick actions: 2 columns
- [ ] All content readable without horizontal scroll
- [ ] Touch targets ≥ 44px (buttons)

### Tablet (768px - 1024px)
- [ ] Stats grid: 2 columns
- [ ] Quick actions: 3 columns

### Desktop (> 1024px)
- [ ] Stats grid: 4 columns
- [ ] Max width container (max-w-7xl)
- [ ] Centered content with proper margins

---

## 5. HOVER & ANIMATION EFFECTS

### Hover Effects
- [ ] Course cards: `hover-lift` (translateY -4px)
- [ ] Recommendation cards: `hover-lift`
- [ ] Action buttons: `hover-glow` (box-shadow glow)
- [ ] All transitions: 180-200ms cubic-bezier

### Animations
- [ ] Stats cards: `animate-fade-in` with stagger
- [ ] Sections: `animate-slide-up` on load
- [ ] Animation delays: 0ms, 100ms, 200ms, 300ms

---

## 6. LOADING & ERROR STATES

### Skeleton Loading
- [ ] Skeleton shows before data loads
- [ ] Skeleton has shimmer effect
- [ ] All sections have skeleton placeholders
- [ ] Smooth transition to real data

### Access Denied
- [ ] Logout → redirects to access denied page
- [ ] "Akses Ditolak" message shows
- [ ] 🚫 emoji displays
- [ ] "Login" button with `bg-merah-500` color
- [ ] Clicking login → redirects to `/sign-in`

---

## 7. ACCESSIBILITY

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicator visible (kuning outline, 2px offset)
- [ ] Tab order is logical
- [ ] Enter/Space activates buttons

### Screen Reader
- [ ] aria-label on icon-only buttons
- [ ] aria-label on sections ("Statistik", "Kursus Terbaru", etc.)
- [ ] role="list" and role="listitem" present
- [ ] Progress bar has aria-label

### Color Contrast
- [ ] Text meets WCAG AA (4.5:1 for body, 3:1 for large)
- [ ] Focus indicator visible on all backgrounds
- [ ] Icons have sufficient contrast

---

## 8. DESIGN SYSTEM CONSISTENCY

### Colors
- [ ] Beige palette used for backgrounds
- [ ] Merah-500 used for primary actions
- [ ] Hijau used for progress/success
- [ ] Kuning used for accents/warnings

### Glass Panels
- [ ] `.glass-panel-light` with 80% opacity
- [ ] Backdrop blur visible
- [ ] Themed borders (beige-300)

### Spacing
- [ ] space-y-8 between sections
- [ ] Consistent padding (p-4, p-6)
- [ ] Proper margins on container

---

## 9. EDGE CASES

### No Recommendations
- [ ] Dashboard renders when `recommendations.length === 0`
- [ ] Recommendations section hidden (not empty container)

### Network Error
- [ ] API fails → fallback to mock data
- [ ] Console error logged
- [ ] Dashboard still renders

### Role Switch
- [ ] Switch role → dashboard updates
- [ ] Stats change based on role
- [ ] Quick actions update

---

## 10. BROWSER COMPATIBILITY

- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Edge: All features work

---

## Notes / Bugs Found

```
Date: __________
Tester: _________

[Bug Report Format]
- Title: _________
- Severity: Low/Medium/High
- Steps: ___________
- Expected: ________
- Actual: __________
```

---

## Pass/Fail Criteria

**PASS**: All critical items (sections 1-4, 6) complete
**FAIL**: Any critical item fails

**Overall Status**: [ ] PASS  [ ] FAIL
