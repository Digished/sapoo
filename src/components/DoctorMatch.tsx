import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { MatchResult } from '@/types'
import { TRAIT_MAP } from '@/lib/traits'

interface Props {
  match: MatchResult
  rank: number
  href: string
}

export default function DoctorMatch({ match, rank, href }: Props) {
  const sharedLabels = match.sharedTraits.map(k => TRAIT_MAP.get(k) ?? k)
  const preview = sharedLabels.slice(0, 2).join(', ')
  const extra = sharedLabels.length - 2

  return (
    <Link
      href={href}
      className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold text-gray-300 shrink-0">#{rank}</span>
          <p className="font-semibold text-gray-900 truncate">{match.name}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <span className="text-green-600 font-bold text-xl tabular-nums">
            {match.similarity}%
          </span>
          <ChevronRight size={16} className="text-gray-300" />
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
        <div
          className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${match.similarity}%` }}
        />
      </div>

      {sharedLabels.length > 0 && (
        <p className="text-xs text-gray-400">
          {preview}
          {extra > 0 && <span className="text-gray-300"> +{extra} more</span>}
        </p>
      )}
    </Link>
  )
}
