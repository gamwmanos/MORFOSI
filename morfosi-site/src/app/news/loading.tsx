// Loading skeleton for the /news page
export default function NewsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero skeleton */}
      <div className="bg-gray-900 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-5">
          <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
          <div className="w-80 h-14 bg-white/10 rounded animate-pulse" />
          <div className="w-64 h-5 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border-4 border-gray-100 overflow-hidden"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-full h-56 bg-gray-100 animate-pulse" />
              <div className="p-6 flex flex-col gap-3">
                <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-full h-6 bg-gray-100 rounded animate-pulse" />
                <div className="w-4/5 h-6 bg-gray-100 rounded animate-pulse" />
                <div className="w-full h-4 bg-gray-50 rounded animate-pulse mt-2" />
                <div className="w-2/3 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-32 h-10 bg-gray-100 rounded animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
