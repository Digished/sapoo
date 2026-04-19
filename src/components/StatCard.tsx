import { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
}

export default function StatCard({ icon: Icon, label, value, sub }: Props) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
      <div className="shrink-0 w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
        <Icon size={18} strokeWidth={2} className="text-green-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="font-semibold text-gray-900 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  )
}
