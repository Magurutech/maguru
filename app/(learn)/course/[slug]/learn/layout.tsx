/**
 * Learn Layout (Route Group)
 *
 * Full-screen app shell — no Navbar, no pt-16 offset.
 * Route group (learn) keeps the URL /course/[slug]/learn
 * while opting out of the parent CourseLayout entirely.
 */
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-beige-50">
      {children}
    </div>
  )
}
