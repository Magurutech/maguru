# Requirements Document Improvements - Assessment Engine

## Summary of Changes

Based on the brainstorm evaluation using YAGNI (You Aren't Gonna Need It) and Simplicity principles, the following improvements were made to `.kiro/specs/assessment-engine/requirements.md`:

---

## 1. Scope Clarification: Section Quiz

**Issue**: Section Quiz was marked as "future feature, deferred" but the design and implementation plan had already agreed to include it in Sprint 2.

**Change**:

- Updated **Glossary** entry for "Section Quiz" from "future feature, deferred" to **"in-scope for Sprint 2"**
- Clarified purpose: "A post-section assessment administered after section completion to unlock the next section"
- Removed Section Quiz from "Out of Scope" section entirely

**Impact**: Requirements now align with the agreed design and plan, preventing confusion during implementation.

---

## 2. Removed Partial Failure Handling (AC 4, Requirement 14)

**Issue**: Requirement 14, AC 4 requested handling partial failures (score saved, lesson skipping failed) with special client notification. This contradicts the Non-Functional Requirement for **Transactional Atomicity** (all-or-nothing) and adds unnecessary complexity for MVP.

**Old AC 4**:

```
WHEN an unexpected error occurs during placement logic,
THE API SHALL still return the score results but NOT execute placement,
notifying the client of partial completion
```

**New AC 3** (consolidated):

```
WHEN a database error occurs during grading or placement,
THE System SHALL rollback all changes (both assessment records and lesson_progress updates)
and return 500 Internal Server Error with the message "Assessment failed. Please try again."
```

**Impact**:

- Enforces transactional atomicity as defined in NFR
- Eliminates complex partial-failure compensation logic
- Simpler implementation: all-or-nothing transaction handling
- Clearer error handling for clients

---

## 3. Simplified UI-Level Gating (Requirement 13)

**Issue**: Requirement 13, AC 5 requested duplicate gating logic at both API level AND React component level, requiring complex state synchronization. Since course layout/sidebar already gates at the enrollment level, per-component verification is redundant.

**Old AC 5**:

```
THIS check SHALL run at the component level (React),
not relying solely on API-level enforcement,
to improve UX responsiveness
```

**Changes**:

- Refocused Requirement 13 on **course layout/sidebar level** gating (not individual components)
- Removed mention of component-level duplication
- Consolidated 5 acceptance criteria into 4 cleaner criteria
- Gating now centralized at enrollment data load time

**New flow**:

1. Course layout loads → checks enrollment's completed assessment
2. If incomplete → display locked state
3. If complete → enable navigation
4. After submission → update enrollment data

**Impact**:

- Single source of truth (enrollment record)
- No state synchronization complexity
- Better performance (check once at layout load)
- Matches agreed UI/Sidebar-level gating architecture

---

## Remaining Scope (Deferred to Future)

Out of Scope section now includes:

- Question randomization or shuffling
- Adaptive difficulty
- Retake mechanics
- Creator UI for question authoring
- Variable passing thresholds (hardcoded 70%)
- Question images or rich media
- Timed assessments with countdown timers

**Removed from deferred**: Section Quiz (now in-scope)

---

## Design Principles Updated

All key design principles remain aligned with YAGNI:

1. **Question topics map to lesson titles** via case-insensitive substring search (MVP limitation documented)
2. **No parser/serializer abstraction** — use Prisma's native JSON type with Zod validation at boundaries
3. **Centralized UI-level gating** — single check at course layout load
4. **Atomic error handling** — transactional all-or-nothing for assessment + placement
5. **Synchronous grading** — no async queue needed for MVP

---

## Validation

✅ Requirements document updated  
✅ Section Quiz scope aligned with design/plan  
✅ Partial failure handling removed (transactional atomicity enforced)  
✅ Component-level gating removed (centralized at layout level)  
✅ YAGNI principles maintained throughout

**Next Steps**: Design and implementation tasks can now proceed with simplified, non-redundant requirements.
