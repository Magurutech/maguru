import { Navbar } from '@/features/homepage/component/Navbars'

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
    </>
  )
}
