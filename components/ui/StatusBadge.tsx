import type { ConnectionStatus, StatusLevel } from '@/types'

type Status = ConnectionStatus | StatusLevel

const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string }> = {
  live: { label: 'Live', color: 'text-[#43A047] bg-[#43A047]/10 border-[#43A047]/30', dot: 'bg-[#43A047]' },
  stale: { label: 'Stale', color: 'text-[#D4A017] bg-[#D4A017]/10 border-[#D4A017]/30', dot: 'bg-[#D4A017]' },
  offline: { label: 'Offline', color: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30', dot: 'bg-[#EF4444]' },
  connecting: { label: 'Connecting', color: 'text-[#00B4D8] bg-[#00B4D8]/10 border-[#00B4D8]/30', dot: 'bg-[#00B4D8]' },
  safe: { label: 'Safe', color: 'text-[#43A047] bg-[#43A047]/10 border-[#43A047]/30', dot: 'bg-[#43A047]' },
  warning: { label: 'Warning', color: 'text-[#D4A017] bg-[#D4A017]/10 border-[#D4A017]/30', dot: 'bg-[#D4A017]' },
  danger: { label: 'Danger', color: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30', dot: 'bg-[#EF4444]' },
  unknown: { label: 'Unknown', color: 'text-gray-400 bg-gray-400/10 border-gray-400/30', dot: 'bg-gray-400' },
}

interface StatusBadgeProps {
  status: Status
  label?: string
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse-dot ${config.dot}`} />
      {label ?? config.label}
    </span>
  )
}
