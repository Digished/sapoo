import { MatchResult } from '@/types'
import { TRAIT_MAP } from '@/lib/traits'

interface Props {
  match: MatchResult
  rank: number
}

export default function DoctorMatch({ match, rank }: Props) {
  const sharedLabels = match.sharedTraits.map(k => TRAIT_MAP.get(k) ?? k)
  const preview = sharedLabels.slice(0, 3).join(', ')
  const extra = sharedLabels.length - 3

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-300">#{rank}</span>
          <div>
            <p className="font-semibold text-gray-900">{match.name}</p>
            {match.department && (
              <p className="text-xs text-gray-400">{match.department}</p>
            )}
          </div>
        </div>
        <span className="text-green-600 font-bold text-xl tabular-nums">
          {match.similarity}%
        </span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${match.similarity}%` }}
        />
      </div>

      {sharedLabels.length > 0 && (
        <p className="text-xs text-gray-400 mt-1">
          {preview}
          {extra > 0 && <span className="text-gray-300"> +{extra} more</span>}
        </p>
      )}
    </div>
  )
}
