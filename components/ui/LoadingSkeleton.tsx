interface LoadingSkeletonProps {
  rows?: number
  className?: string
}

export default function LoadingSkeleton({ rows = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`} aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full"
          style={{ width: `${100 - (i % 3) * 15}%` }}
        />
      ))}
    </div>
  )
}
