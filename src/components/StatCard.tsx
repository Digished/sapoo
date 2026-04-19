import { LucideIcon } from 'lucide-react'

type StatColor = 'green' | 'violet' | 'rose' | 'amber' | 'sky'

const styles: Record<StatColor, { bg: string; icon: string }> = {
  green:  { bg: 'bg-green-50',  icon: 'text-green-500'  },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-500' },
  rose:   { bg: 'bg-rose-50',   icon: 'text-rose-500'   },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-500'  },
  sky:    { bg: 'bg-sky-50',    icon: 'text-sky-500'    },
}

interface Props {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  color?: StatColor
}

export default function StatCard({ icon: Icon, label, value, sub, color = 'green' }: Props) {
  const { bg, icon } = styles[color]

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
      <div className={`shrink-0 w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
        <Icon size={18} strokeWidth={2} className={icon} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="font-semibold text-gray-900 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  )
}
