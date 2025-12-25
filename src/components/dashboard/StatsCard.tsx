import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  iconColor: 'indigo' | 'yellow' | 'green' | 'blue' | 'purple' | 'red'
  label: string
  value: number | string
  sublabel?: string
}

const colorClasses = {
  indigo: 'bg-indigo-100 text-indigo-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600'
}

export function StatsCard({
  icon: Icon,
  iconColor,
  label,
  value,
  sublabel
}: StatsCardProps) {
  return (
    <div className='bg-white rounded-lg shadow-sm p-4'>
      <div className='flex items-center'>
        <div className={`rounded-md p-3 ${colorClasses[iconColor]}`}>
          <Icon className='h-6 w-6' />
        </div>
        <div className='ml-4 flex-1'>
          <h3 className='text-sm font-semibold text-gray-900'>
            {label}
          </h3>
          <p className='text-2xl font-bold text-gray-900'>{value}</p>
          {sublabel && <p className='text-xs text-gray-500 mt-1'>{sublabel}</p>}
        </div>
      </div>
    </div>
  )
}
