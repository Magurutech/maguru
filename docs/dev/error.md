## Error Type
Console ReferenceError

## Error Message
SkeuButton is not defined


    at UIElementsShowcase (app\design-system\ui-elements\page.tsx:220:14)
    at UserRoleProvider (features/auth/context/UserRoleContext.tsx:353:5)
    at RootLayout (app\layout.tsx:54:11)

## Code Frame
  218 |           <div className="space-y-3 mt-2 text-left">
  219 |             <div className="text-caption text-text-muted">Gunakan tombol di bawah untuk merasakan efek magnetis ditekan:</div>
> 220 |             <SkeuButton variant="peach">
      |              ^
  221 |               Tekan Saya (Skeuo Peach)
  222 |             </SkeuButton>
  223 |             <div className="text-caption text-text-faint text-center">

Next.js version: 16.1.6 (Turbopack)
