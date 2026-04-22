'use client'

import { useEffect, useState } from 'react'
import { Trophy, BarChart3, ChevronDown, ChevronUp } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { TRAITS } from '@/lib/traits'
import { TraitColor } from '@/types'
import { cn } from '@/lib/utils'

interface RawResponse { user_id: string; trait_key: string }
interface RawUser    { id: string; name: string }

interface Pair {
  aName: string
  bName: string
  pct: number
  shared: string[]
}

interface TraitStat {
  key: string
  label: string
  color: TraitColor
  icon: React.ElementType
  count: number
  names: string[]
}

const colorText: Record<TraitColor, string> = {
  green:  'text-green-500',
  violet: 'text-violet-500',
  rose:   'text-rose-500',
  amber:  'text-amber-500',
  sky:    'text-sky-500',
}

const colorBg: Record<TraitColor, string> = {
  green:  'bg-green-50',
  violet: 'bg-violet-50',
  rose:   'bg-rose-50',
  amber:  'bg-amber-50',
  sky:    'bg-sky-50',
}

const colorBadge: Record<TraitColor, string> = {
  green:  'bg-green-100 text-green-700',
  violet: 'bg-violet-100 text-violet-700',
  rose:   'bg-rose-100 text-rose-700',
  amber:  'bg-amber-100 text-amber-700',
  sky:    'bg-sky-100 text-sky-700',
}

const NAMES_PREVIEW = 5

export default function LiveStats() {
  const [topPairs, setTopPairs]     = useState<Pair[]>([])
  const [traitStats, setTraitStats] = useState<TraitStat[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [expandedTrait, setExpandedTrait] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const [responsesRes, usersRes] = await Promise.all([
        getSupabase().from('responses').select('user_id, trait_key'),
        getSupabase().from('users').select('id, name'),
      ])

      const allResponses: RawResponse[] = responsesRes.data ?? []
      const allUsers: RawUser[]         = usersRes.data ?? []
      if (allResponses.length === 0) { setIsLoading(false); return }

      const userMap = new Map(allUsers.map(u => [u.id, u.name]))

      // Group by user
      const byUser = new Map<string, Set<string>>()
      for (const r of allResponses) {
        if (!byUser.has(r.user_id)) byUser.set(r.user_id, new Set())
        byUser.get(r.user_id)!.add(r.trait_key)
      }

      // All pairs
      const userIds = Array.from(byUser.keys())
      const pairs: Pair[] = []
      for (let i = 0; i < userIds.length; i++) {
        for (let j = i + 1; j < userIds.length; j++) {
          const aId = userIds[i], bId = userIds[j]
          const aSet = byUser.get(aId)!, bSet = byUser.get(bId)!
          const shared = Array.from(aSet).filter(k => bSet.has(k))
          const maxSize = Math.max(aSet.size, bSet.size)
          if (maxSize === 0 || shared.length === 0) continue
          const pct = Math.round((shared.length / maxSize) * 100)
          pairs.push({
            aName: userMap.get(aId) ?? '?',
            bName: userMap.get(bId) ?? '?',
            pct,
            shared,
          })
        }
      }
      pairs.sort((a, b) => b.pct - a.pct || b.shared.length - a.shared.length)
      setTopPairs(pairs.slice(0, 5))

      // Trait stats
      const byTrait = new Map<string, string[]>()
      for (const r of allResponses) {
        if (!byTrait.has(r.trait_key)) byTrait.set(r.trait_key, [])
        const name = userMap.get(r.user_id)
        if (name) byTrait.get(r.trait_key)!.push(name)
      }

      const stats: TraitStat[] = TRAITS
        .map(t => ({
          key: t.key, label: t.label, color: t.color, icon: t.icon,
          count: byTrait.get(t.key)?.length ?? 0,
          names: byTrait.get(t.key) ?? [],
        }))
        .filter(s => s.count > 0)
        .sort((a, b) => b.count - a.count)

      setTraitStats(stats)
      setIsLoading(false)
    }
    load()
  }, [])

  if (isLoading || (topPairs.length === 0 && traitStats.length === 0)) return null

  return (
    <div className="w-full max-w-sm mx-auto space-y-5 pb-10">

      {/* Top Pairs */}
      {topPairs.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Trophy size={14} className="text-amber-500" strokeWidth={2.2} />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Top Colleague Pairs</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {topPairs.map((pair, i) => (
              <div key={`${pair.aName}-${pair.bName}`} className={cn('px-4 py-3', i > 0 && 'border-t border-gray-50')}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-gray-300 shrink-0">#{i + 1}</span>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {pair.aName} &amp; {pair.bName}
                    </p>
                  </div>
                  <span className="shrink-0 ml-2 text-sm font-bold text-green-600 tabular-nums">
                    {pair.pct}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed pl-5 truncate">
                  {pair.shared
                    .map(k => TRAITS.find(t => t.key === k)?.label ?? k)
                    .join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trait Breakdown */}
      {traitStats.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <BarChart3 size={14} className="text-violet-500" strokeWidth={2.2} />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Trait Breakdown</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {traitStats.map((stat, i) => {
              const Icon = stat.icon
              const isExpanded = expandedTrait === stat.key
              const preview = stat.names.slice(0, NAMES_PREVIEW)
              const extra   = stat.names.length - NAMES_PREVIEW

              return (
                <div key={stat.key} className={cn(i > 0 && 'border-t border-gray-50')}>
                  <button
                    onClick={() => setExpandedTrait(prev => prev === stat.key ? null : stat.key)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', colorBg[stat.color])}>
                      <Icon size={13} strokeWidth={2.2} className={colorText[stat.color]} />
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-800 truncate">{stat.label}</span>
                    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0', colorBadge[stat.color])}>
                      {stat.count}
                    </span>
                    {isExpanded
                      ? <ChevronUp size={14} className="text-gray-300 shrink-0" />
                      : <ChevronDown size={14} className="text-gray-300 shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3 pl-14">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {preview.join(', ')}
                        {extra > 0 && (
                          <span className="text-gray-400"> +{extra} more</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
