import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export default function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
        {icon ?? <Inbox size={28} />}
      </div>
      <h3 className="text-gray-700 dark:text-gray-300 font-bold text-base mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
