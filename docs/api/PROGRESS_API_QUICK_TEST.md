# Progress API - Quick Testing Guide

**⚡ Quick Reference untuk Testing Progress Tracking API**

---

## 🚀 Quick Start (5 Minutes)

### 1. Setup Environment Variables

```bash
# Set di Postman Collection Variables
base_url = http://localhost:3000
clerk_token = YOUR_CLERK_TOKEN_HERE
lesson_id = YOUR_LESSON_ID
course_slug = YOUR_COURSE_TITLE
```

### 2. Get Test Data

```sql
-- Get lesson ID
SELECT id, title FROM lessons LIMIT 1;

-- Get course slug (title)
SELECT title FROM courses LIMIT 1;
```

### 3. Run Basic Test

```bash
# Test 1: Mark lesson complete
curl -X POST http://localhost:3000/api/progress/lesson/LESSON_ID/complete \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test 2: Check lesson progress
curl http://localhost:3000/api/progress/lesson/LESSON_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test 3: Check course progress
curl http://localhost:3000/api/progress/course/COURSE_SLUG \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 Testing Checklist

### ✅ Pre-Testing
- [ ] Server running (`yarn dev`)
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] Clerk token obtained
- [ ] Test data exists (courses, sections, lessons)
- [ ] Postman collection imported

### ✅ Basic Tests
- [ ] Mark lesson as complete (POST)
- [ ] Get lesson progress (GET)
- [ ] Get course progress (GET)
- [ ] Verify percentage calculation
- [ ] Check completion flag at 100%

### ✅ Edge Cases
- [ ] Invalid lesson ID → 404
- [ ] Invalid course slug → 404
- [ ] No auth token → 401
- [ ] Course with 0 lessons → 0%
- [ ] Mark same lesson twice → idempotent

### ✅ Integration
- [ ] Complete lesson → course progress updates
- [ ] Progress persists after refresh
- [ ] Multiple lessons → percentage increases correctly
- [ ] Complete all lessons → completed flag true

---

## 🎯 Expected Results

### Mark Lesson Complete
```json
{
  "id": "uuid",
  "lessonId": "lesson-uuid",
  "userId": "user_id",
  "completed": true,
  "completedAt": "2026-03-11T10:30:00.000Z",
  "createdAt": "2026-03-11T10:30:00.000Z"
}
```

### Get Lesson Progress
```json
{
  "lessonId": "lesson-uuid",
  "userId": "user_id",
  "completed": true,
  "completedAt": "2026-03-11T10:30:00.000Z"
}
```

### Get Course Progress
```json
{
  "courseId": "course-uuid",
  "userId": "user_id",
  "percentage": 66.67,
  "completedLessons": 4,
  "totalLessons": 6,
  "completed": false,
  "completedAt": null
}
```

---

## 🔍 Quick Validation

### Percentage Calculation
```
percentage = (completedLessons / totalLessons) × 100
rounded to 2 decimal places

Example:
4 / 6 × 100 = 66.666... → 66.67
```

### Completion Flag
```
completed = true  when percentage === 100
completed = false when percentage < 100
```

### Timestamp Format
```
ISO 8601: "2026-03-11T10:30:00.000Z"
```

---

## 🐛 Quick Troubleshooting

| Error | Solution |
|-------|----------|
| 401 Unauthorized | Check Clerk token validity |
| 404 Not Found | Verify lesson/course ID exists |
| 500 Server Error | Check server logs, database connection |
| Wrong percentage | Verify total/completed lesson counts |

---

## 📊 Test Scenarios

### Scenario 1: First Lesson (2 min)
1. Get course progress → 0%
2. Mark lesson complete
3. Get course progress → should increase

### Scenario 2: Complete Course (3 min)
1. Mark all lessons complete
2. Get course progress
3. Verify: `completed: true`, `percentage: 100`

### Scenario 3: Persistence (1 min)
1. Mark lesson complete
2. Refresh/new request
3. Verify status persisted

---

## 🎓 Success Criteria

✅ All endpoints return 200 OK  
✅ Percentage calculation accurate  
✅ Completion flag correct at 100%  
✅ Progress persists across requests  
✅ Authentication enforced  
✅ Error responses descriptive  

---

## 📞 Need Help?

- Full documentation: `docs/api/PROGRESS_API_TESTING.md`
- Postman collection: `docs/api/progress-tracking.postman_collection.json`
- Requirements: `.kiro/specs/course-content-management-v2/requirements.md`

---

**Quick Test Time:** ~5 minutes  
**Full Test Suite:** ~15 minutes  
**Last Updated:** 2026-03-11
