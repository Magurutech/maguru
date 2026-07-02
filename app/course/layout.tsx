import { NavbarGlass } from '@/features/homepage/components/NavbarGlass'

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarGlass />
      <div className="pt-16">{children}</div>
    </>
  )
}

