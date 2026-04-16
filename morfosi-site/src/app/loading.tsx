// Root-level loading.tsx — shown while the root layout is fetching data (e.g. Sanity settings)
// Each page can override this with its own loading.tsx in its folder

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fake header skeleton */}
      <div className="w-full h-[72px] bg-gray-900 animate-pulse" />

      {/* Fake hero skeleton */}
      <div className="w-full bg-[#031516] pt-48 pb-36 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="w-48 h-5 bg-white/10 rounded animate-pulse" />
            <div className="w-full h-20 bg-white/10 rounded animate-pulse" />
            <div className="w-3/4 h-20 bg-white/10 rounded animate-pulse" />
            <div className="w-full h-6 bg-white/5 rounded animate-pulse mt-2" />
            <div className="w-2/3 h-6 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton rows */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-full h-48 bg-gray-100 rounded animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              <div className="w-3/4 h-5 bg-gray-100 rounded animate-pulse" style={{ animationDelay: `${i * 80 + 40}ms` }} />
              <div className="w-1/2 h-4 bg-gray-100 rounded animate-pulse" style={{ animationDelay: `${i * 80 + 80}ms` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
