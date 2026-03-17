PS D:\.maguru\maguru> yarn test:api:creator
yarn run v1.22.22
$ newman run docs/api/creator-course/creator-course.postman_collection.json --environment docs/api/newman-env.json --reporters cli
(node:27940) [DEP0176] DeprecationWarning: fs.F_OK is deprecated, use fs.constants.F_OK instead
(Use `node --trace-deprecation ...` to show where the warning was created)
newman

Creator Course API

□ 1. GET /api/creator/courses
└ Get Creator Courses - Unauthenticated (401)
  GET http://localhost:3000/api/creator/courses [401 Unauthorized, 542B, 119ms]
  √  Status code is 401
  √  Response has error

└ Get Creator Courses - Success (200)
  GET http://localhost:3000/api/creator/courses [401 Unauthorized, 542B, 56ms]
  1. Status code is 200
  2. Has courses and stats
  3. Stats fields correct
  4. Each course has required fields

□ 2. POST /api/creator/courses
└ Create Course - Unauthenticated (401)
  POST http://localhost:3000/api/creator/courses [401 Unauthorized, 559B, 48ms]
  √  Status code is 401
  √  Has error

└ Create Course - Missing Required Fields (400)
  POST http://localhost:3000/api/creator/courses [401 Unauthorized, 559B, 32ms]
  5. Status code is 400
  √  Has error

└ Create Course - Invalid Difficulty (400)
  POST http://localhost:3000/api/creator/courses [401 Unauthorized, 559B, 32ms]
  6. Status code is 400
  7. Error mentions difficulty

└ Create Course - Success (201)
  POST http://localhost:3000/api/creator/courses [401 Unauthorized, 559B, 52ms]
  8. Status code is 201
  9. Has course data
 10. Status is DRAFT

□ 3. PUT /api/creator/courses/[slug]/publish
└ Publish Course - Unauthenticated (401)
  PUT http://localhost:3000/api/creator/courses/78322b16-3758-4861-9e79-e647b36d9ab5/publish [401 Unauthorized, 604B, 1071ms]
  √  Status code is 401
  √  Has error

└ Publish Course - Not Owner (403)
  PUT http://localhost:3000/api/creator/courses/78322b16-3758-4861-9e79-e647b36d9ab5/publish [401 Unauthorized, 604B, 51ms]
 11. Status code is 403
  √  Has error

└ Publish Course - DRAFT to PUBLISHED (200)
  PUT http://localhost:3000/api/creator/courses/78322b16-3758-4861-9e79-e647b36d9ab5/publish
 [401 Unauthorized, 604B, 35ms]
 12. Status code is 200
 13. Has course with status
 14. Status is PUBLISHED

└ Unpublish Course - PUBLISHED to DRAFT (200)
  PUT http://localhost:3000/api/creator/courses/78322b16-3758-4861-9e79-e647b36d9ab5/publish
 [401 Unauthorized, 604B, 33ms]
 15. Status code is 200
 16. Status is DRAFT

┌─────────────────────────┬─────────────────────┬────────────────────┐
│                         │            executed │             failed │
├─────────────────────────┼─────────────────────┼────────────────────┤
│              iterations │                   1 │                  0 │
├─────────────────────────┼─────────────────────┼────────────────────┤
│                requests │                  10 │                  0 │
├─────────────────────────┼─────────────────────┼────────────────────┤
│            test-scripts │                  10 │                  0 │
├─────────────────────────┼─────────────────────┼────────────────────┤
│      prerequest-scripts │                   0 │                  0 │
├─────────────────────────┼─────────────────────┼────────────────────┤
│              assertions │                  24 │                 16 │
├─────────────────────────┴─────────────────────┴────────────────────┤
│ total run duration: 2.4s                                           │
├────────────────────────────────────────────────────────────────────┤
│ total data received: 376B (approx)                                 │
├────────────────────────────────────────────────────────────────────┤
│ average response time: 152ms [min: 32ms, max: 1071ms, s.d.: 307ms] │
└────────────────────────────────────────────────────────────────────┘

   #  failure          detail

 01.  AssertionError   Status code is 200
                       expected response to have status code 200 but got 401
                       at assertion:0 in test-script
                       inside "1. GET /api/creator/courses / Get Creator Courses -
                       Success (200)"

 02.  AssertionError   Has courses and stats
                       expected { error: 'Unauthorized' } to have property 'courses'        
                       at assertion:1 in test-script
                       inside "1. GET /api/creator/courses / Get Creator Courses -
                       Success (200)"

 03.  AssertionError   Stats fields correct
                       Target cannot be null or undefined.
                       at assertion:2 in test-script
                       inside "1. GET /api/creator/courses / Get Creator Courses -
                       Success (200)"

 04.  TypeError        Each course has required fields
                       Cannot read properties of undefined (reading 'length')
                       at assertion:3 in test-script
                       inside "1. GET /api/creator/courses / Get Creator Courses -
                       Success (200)"

 05.  AssertionError   Status code is 400
                       expected response to have status code 400 but got 401
                       at assertion:0 in test-script
                       inside "2. POST /api/creator/courses / Create Course - Missing       
                       Required Fields (400)"

 06.  AssertionError   Status code is 400
                       expected response to have status code 400 but got 401
                       at assertion:0 in test-script
                       inside "2. POST /api/creator/courses / Create Course - Invalid       
                       Difficulty (400)"

 07.  AssertionError   Error mentions difficulty
                       expected false to be true
                       at assertion:1 in test-script
                       inside "2. POST /api/creator/courses / Create Course - Invalid       
                       Difficulty (400)"

 08.  AssertionError   Status code is 201
                       expected response to have status code 201 but got 401
                       at assertion:0 in test-script
                       inside "2. POST /api/creator/courses / Create Course - Success       
                       (201)"

 09.  AssertionError   Has course data
                       Target cannot be null or undefined.
                       at assertion:1 in test-script
                       inside "2. POST /api/creator/courses / Create Course - Success       
                       (201)"

 10.  TypeError        Status is DRAFT
                       Cannot read properties of undefined (reading 'status')
                       at assertion:2 in test-script
                       inside "2. POST /api/creator/courses / Create Course - Success       
                       (201)"

 11.  AssertionError   Status code is 403
                       expected response to have status code 403 but got 401
                       at assertion:0 in test-script
                       inside "3. PUT /api/creator/courses/[slug]/publish / Publish
                       Course - Not Owner (403)"

 12.  AssertionError   Status code is 200
                       expected response to have status code 200 but got 401
                       at assertion:0 in test-script
                       inside "3. PUT /api/creator/courses/[slug]/publish / Publish
                       Course - DRAFT to PUBLISHED (200)"

 13.  AssertionError   Has course with status
                       Target cannot be null or undefined.
                       at assertion:1 in test-script
                       inside "3. PUT /api/creator/courses/[slug]/publish / Publish
                       Course - DRAFT to PUBLISHED (200)"

 14.  TypeError        Status is PUBLISHED
                       Cannot read properties of undefined (reading 'status')
                       at assertion:2 in test-script
                       inside "3. PUT /api/creator/courses/[slug]/publish / Publish
                       Course - DRAFT to PUBLISHED (200)"

 15.  AssertionError   Status code is 200
                       expected response to have status code 200 but got 401
                       at assertion:0 in test-script
                       inside "3. PUT /api/creator/courses/[slug]/publish / Unpublish       
                       Course - PUBLISHED to DRAFT (200)"

 16.  TypeError        Status is DRAFT
                       Cannot read properties of undefined (reading 'status')
                       at assertion:1 in test-script
                       inside "3. PUT /api/creator/courses/[slug]/publish / Unpublish       
                       Course - PUBLISHED to DRAFT (200)"
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.        
PS D:\.maguru\maguru> 