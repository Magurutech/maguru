[Fast Refresh] done in 120ms
installHook.js:1 Error: React.Children.only expected to receive a single React element child.
    at Object.only (react.development.js:778:17)
    at Slot.SlotClone (slot.tsx:117:64)
    at Object.react_stack_bottom_frame (react-dom-client.development.js:23583:20)
    at renderWithHooks (react-dom-client.development.js:6792:22)
    at updateForwardRef (react-dom-client.development.js:8806:19)
    at beginWork (react-dom-client.development.js:11196:18)
    at runWithFiberInDEV (react-dom-client.development.js:871:30)
    at performUnitOfWork (react-dom-client.development.js:15726:22)
    at workLoopSync (react-dom-client.development.js:15546:41)
    at renderRootSync (react-dom-client.development.js:15526:11)
    at performWorkOnRoot (react-dom-client.development.js:15033:44)
    at performWorkOnRootViaSchedulerTask (react-dom-client.development.js:16815:7)
    at MessagePort.performWorkUntilDeadline (scheduler.development.js:45:48)

The above error occurred in the <Unknown> component. It was handled by the <RoleErrorBoundary> error boundary.


## Error Type
Console Error

## Error Message
React.Children.only expected to receive a single React element child.


    at UserRoleProvider (features/auth/context/UserRoleContext.tsx:353:5)
    at RootLayout (app\layout.tsx:45:11)

## Code Frame
  351 |
  352 |   return (
> 353 |     <RoleErrorBoundary fallback={ErrorFallback}>
      |     ^
  354 |       <UserRoleContext.Provider value={contextValue}>
  355 |         {children}
  356 |         {devMode.enabled && devMode.allowRoleSwitching && (

Next.js version: 15.5.3 (Turbopack)
