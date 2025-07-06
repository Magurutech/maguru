# E2E Test Documentation - Course Management

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Test Architecture](#test-architecture)
3. [Test Scenarios](#test-scenarios)
4. [Test Data Management](#test-data-management)
5. [Performance Metrics](#performance-metrics)
6. [Execution Strategy](#execution-strategy)

## Pendahuluan

Dokumentasi ini menjelaskan End-to-End (E2E) testing untuk fitur Course Management menggunakan Playwright dengan pendekatan BDD (Behavior-Driven Development). Testing fokus pada validasi complete user journey dari perspektif end user.

**Browser Coverage**: Chromium browser only
**Test Environment**: Local development dan staging environment
**Approach**: BDD dengan format Given-When-Then

## Test Architecture

### File Structure

```
__tests__/
└── playwright/
    ├── course/
    │   ├── course-creation.spec.ts     # Test pembuatan kursus
    │   ├── course-management.spec.ts   # Test edit/delete kursus
    │   ├── course-authorization.spec.ts # Test role-based access
    │   └── course-search-filter.spec.ts # Test search dan filter
    ├── fixtures/
    │   ├── course-test-data.ts            # Test data factories
    └── utils/
        ├── course-helpers.ts              # Course-specific helpers
```

### Test Categories

1. **Course Creation Tests** - Validasi pembuatan kursus baru
2. **Course Management Tests** - Validasi edit dan delete kursus
3. **Authorization Tests** - Validasi role-based access control
4. **Search & Filter Tests** - Validasi fitur pencarian dan filter

## Test Scenarios

### Course Creation Flow

#### Happy Path Scenarios

1. **Creator Creates Course Successfully**
   - Given: Creator is logged in and on course management page
   - When: Creator fills course form with valid data and submits
   - Then: Course is created and appears in course list

2. **Admin Creates Course Successfully**
   - Given: Admin is logged in and on course management page
   - When: Admin fills course form with valid data and submits
   - Then: Course is created with admin as owner

#### Error Scenarios

3. **Validation Error - Empty Title**
   - Given: Creator is on course creation form
   - When: Creator submits form with empty title
   - Then: Error message is displayed for title field

4. **Validation Error - Short Title**
   - Given: Creator is on course creation form
   - When: Creator submits form with title less than 3 characters
   - Then: Error message is displayed for title validation

5. **Validation Error - Empty Description**
   - Given: Creator is on course creation form
   - When: Creator submits form with empty description
   - Then: Error message is displayed for description field

6. **Network Error - Server Error**
   - Given: Creator is on course creation form
   - When: Server returns error during submission
   - Then: Error message with retry option is displayed

7. **Network Error - Timeout**
   - Given: Creator is on course creation form
   - When: Request times out during submission
   - Then: Timeout error message is displayed

### Course Management Flow

#### Edit Course Scenarios

8. **Creator Edits Own Course**
   - Given: Creator is on course list page
   - When: Creator clicks edit button on own course
   - Then: Edit form opens with pre-filled data

9. **Creator Updates Course Successfully**
   - Given: Creator is on course edit form
   - When: Creator updates data and submits
   - Then: Course is updated and changes are reflected

10. **Admin Edits Creator Course**
    - Given: Admin is on course list page
    - When: Admin clicks edit button on creator's course
    - Then: Edit form opens and admin can modify course

#### Delete Course Scenarios

11. **Creator Deletes Own Course**
    - Given: Creator is on course list page
    - When: Creator clicks delete button and confirms
    - Then: Course is deleted from list

12. **Admin Deletes Any Course**
    - Given: Admin is on course list page
    - When: Admin clicks delete button on any course and confirms
    - Then: Course is deleted from list

13. **Delete Confirmation Dialog**
    - Given: User clicks delete button on course
    - When: Confirmation dialog appears
    - Then: User can cancel or confirm deletion

### Authorization Flow

#### Access Control Scenarios

14. **Unauthorized User Access**
    - Given: User without creator/admin role tries to access course management
    - When: User navigates to course management page
    - Then: User is redirected to unauthorized page

15. **Session Expired Access**
    - Given: User with expired session tries to access course management
    - When: User navigates to course management page
    - Then: User is redirected to login page

16. **Creator Access to Course Management**
    - Given: Creator is logged in
    - When: Creator navigates to course management page
    - Then: Creator can access all course management features

17. **Admin Access to Course Management**
    - Given: Admin is logged in
    - When: Admin navigates to course management page
    - Then: Admin can access all course management features

### Search and Filter Flow

#### Search Functionality

18. **Search by Course Title**
    - Given: User is on course list page
    - When: User enters search term in search box
    - Then: Course list is filtered based on search term

19. **Search with No Results**
    - Given: User searches for non-existent course
    - When: Search returns no results
    - Then: Empty state message is displayed

20. **Clear Search Results**
    - Given: User has active search results
    - When: User clears search input
    - Then: All courses are displayed again

#### Filter Functionality

21. **Filter by Draft Status**
    - Given: User is on course list page
    - When: User selects "Draft" filter
    - Then: Only draft courses are displayed

22. **Filter by Published Status**
    - Given: User is on course list page
    - When: User selects "Published" filter
    - Then: Only published courses are displayed

23. **Filter State Persistence**
    - Given: User has active filter applied
    - When: User navigates away and returns
    - Then: Filter state is maintained

## Test Data Management

### Test Data Setup

- Clean database before each test suite
- Create fresh test data for each test scenario
- Isolate test data between parallel tests
- Use deterministic test data for consistent results

### Test Data Cleanup

- Automatic cleanup after test completion
- Manual cleanup for interrupted tests
- Separate test database for isolation

### Test Data Types

1. **Course Test Data**
   - Valid course data with different statuses
   - Invalid course data for validation testing
   - Edge case data for boundary testing

2. **User Test Data**
   - Creator users with different permission levels
   - Admin users with full access
   - Regular users without course access

## Performance Metrics

### Performance Baselines

- Page load time: < 3 seconds
- Form submission response: < 2 seconds
- Navigation transitions: < 1 second
- Search/filter response: < 1 second

### Performance Test Scenarios

24. **Course List Page Load Performance**
    - Given: User navigates to course list page
    - When: Page loads with multiple courses
    - Then: Page load time is within acceptable range

25. **Course Creation Form Performance**
    - Given: User opens course creation form
    - When: Form loads with all fields
    - Then: Form load time is within acceptable range

26. **Search Performance with Large Dataset**
    - Given: Course list has many courses
    - When: User performs search operation
    - Then: Search response time is within acceptable range

## Execution Strategy

### Local Development

- Run tests against local development server
- Fast feedback for developer
- Debugging with headed mode
- Individual test execution for development

### CI/CD Pipeline

- Run tests on every PR
- Use headless mode for performance
- Generate artifacts (screenshots, videos) for failures
- Parallel execution where possible

### Staging Environment

- Comprehensive test suite before production release
- Full test coverage validation
- Performance validation against staging data

### Test Execution Commands

```bash
# Run all course E2E tests
yarn test:e2e:course

# Run specific test file
yarn test:e2e:course:creation

# Run tests with headed mode for debugging
yarn test:e2e:course:debug

```

### Test Reporting

- HTML report generation after test completion
- Screenshot capture on test failures
- Video recording for failed test scenarios
- Performance metrics reporting
- Test coverage summary
