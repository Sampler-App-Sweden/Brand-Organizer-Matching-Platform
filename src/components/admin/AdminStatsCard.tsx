interface AdminStatsCardProps {
  label: string
  value: number
  isActive: boolean
  onClick: () => void
  sublabel?: string
}

export function AdminStatsCard({
  label,
  value,
  isActive,
  onClick,
  sublabel
}: AdminStatsCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-lg p-4 cursor-pointer transition-all
        ${
          isActive
            ? 'bg-indigo-50 ring-2 ring-indigo-500'
            : 'bg-gray-50 hover:bg-gray-100'
        }
      `}
    >
      <div
        className={`text-2xl font-bold ${
          isActive ? 'text-indigo-600' : 'text-gray-900'
        }`}
      >
        {value}
      </div>
      <div
        className={`text-sm ${
          isActive ? 'text-indigo-700 font-medium' : 'text-gray-600'
        }`}
      >
        {label}
      </div>
      {sublabel && (
        <div
          className={`text-xs mt-1 ${
            isActive ? 'text-indigo-600' : 'text-gray-500'
          }`}
        >
          {sublabel}
        </div>
      )}
    </div>
  )
}
