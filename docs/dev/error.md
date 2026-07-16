## Error Type
Console Error

## Error Message
Event handlers cannot be passed to Client Component props.
  <div className=... style={{...}} onMouseEnter=... onMouseLeave={function onMouseLeave} children=...>
                                                                 ^^^^^^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.


    at stringify (<anonymous>:1:18)
    at stringify (<anonymous>:1:18)
    at UserRoleProvider (features/auth/context/UserRoleContext.tsx:353:5)
    at RootLayout (app\layout.tsx:47:11)

## Code Frame
  351 |
  352 |   return (
> 353 |     <RoleErrorBoundary fallback={ErrorFallback}>
      |     ^
  354 |       <UserRoleContext.Provider value={contextValue}>
  355 |         {children}
  356 |         {devMode.enabled && devMode.allowRoleSwitching && (

Next.js version: 16.1.6 (Turbopack)
