// Loading skeleton for the /exams page
export default function ExamsLoading() {
  return (
    <div className="min-h-screen bg-brand-teal-dark flex flex-col">
      {/* Header skeleton */}
      <div className="bg-brand-teal-dark px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="w-48 h-4 bg-white/10 rounded animate-pulse" />
          <div className="w-72 h-12 bg-white/10 rounded animate-pulse" />
          {/* Tab bar skeleton */}
          <div className="flex gap-3 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-36 h-12 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Exam cards skeleton */}
      <div className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border-4 border-black/20 p-6 flex flex-col gap-4"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-gray-100 rounded animate-pulse flex-shrink-0" />
                <div className="flex-1 h-5 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="w-3/4 h-4 bg-gray-50 rounded animate-pulse" />
              <div className="w-full h-10 bg-gray-100 rounded animate-pulse mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
