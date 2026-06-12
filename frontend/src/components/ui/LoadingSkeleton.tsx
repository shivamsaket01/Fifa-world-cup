export const CardSkeleton = () => (
  <div className="bg-card border rounded-xl p-6 shadow-sm animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 bg-muted rounded w-20"></div>
      <div className="h-4 bg-muted rounded w-16"></div>
    </div>
    <div className="flex justify-between items-center mb-6">
      <div className="flex-1 flex flex-col items-center">
        <div className="w-12 h-12 bg-muted rounded-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-16"></div>
      </div>
      <div className="h-8 bg-muted rounded w-24 mx-4"></div>
      <div className="flex-1 flex flex-col items-center">
        <div className="w-12 h-12 bg-muted rounded-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-16"></div>
      </div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="w-full animate-pulse border rounded-xl overflow-hidden">
    <div className="h-12 bg-muted border-b"></div>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-16 border-b flex items-center px-4">
        <div className="h-6 bg-muted rounded w-8 mr-4"></div>
        <div className="h-8 w-8 bg-muted rounded-full mr-4"></div>
        <div className="h-4 bg-muted rounded w-32 flex-1"></div>
        <div className="h-4 bg-muted rounded w-8 ml-4"></div>
      </div>
    ))}
  </div>
);
