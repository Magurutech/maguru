## Error Type
Console Error

## Error Message
HTTP 404: Not Found


    at getDashboardData (features/dashboard/api.ts:26:13)

## Code Frame
  24 |
  25 |     if (!response.ok) {
> 26 |       throw new Error(`HTTP ${response.status}: ${response.statusText}`)
     |             ^
  27 |     }
  28 |
  29 |     return await response.json()

Next.js version: 15.5.3 (Turbopack)
