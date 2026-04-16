// Loading skeleton for the /teachers page
export default function TeachersLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="bg-gray-900 py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-5">
          <div className="w-36 h-4 bg-white/10 rounded animate-pulse" />
          <div className="w-96 h-16 bg-white/10 rounded animate-pulse" />
          <div className="w-64 h-5 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      {/* Teacher cards skeleton */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border-4 border-gray-100 overflow-hidden"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {/* Avatar */}
              <div className="w-full h-64 bg-gray-100 animate-pulse" />
              {/* Info */}
              <div className="p-6 flex flex-col gap-3">
                <div className="w-full h-6 bg-gray-100 rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
