function CourseCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl glass-panel card-ancient animate-pulse">
      <div className="aspect-video bg-white/10 rounded-t-2xl" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-white/10 rounded-lg" />
        <div className="h-4 bg-white/10 rounded w-2/3" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-white/10 rounded" />
          <div className="h-4 bg-white/10 rounded w-16" />
          <div className="h-4 bg-white/10 rounded w-20 ml-auto" />
        </div>
        <div className="h-10 bg-white/10 rounded-lg" />
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDE0] via-[#F0E6D6] to-[#EBE0CC] flex flex-col items-center justify-center py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
