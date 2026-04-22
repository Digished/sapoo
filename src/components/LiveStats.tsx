'use client'

import { useEffect, useState } from 'react'
import { Trophy, BarChart3 } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { TRAITS } from '@/lib/traits'
import { TraitColor } from '@/types'
import { cn } from '@/lib/utils'

interface RawResponse { user_id: string; trait_key: string }
interface RawUser    { id: string; name: string }

interface ColleagueBest {
  userName: string
  bestMatchName: string
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

export default function LiveStats() {
  const [colleagueBests, setColleagueBests] = useState<ColleagueBest[]>([])
  const [traitStats, setTraitStats]         = useState<TraitStat[]>([])
  const [isLoading, setIsLoading]           = useState(true)

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

      // Group responses by user
      const byUser = new Map<string, Set<string>>()
      for (const r of allResponses) {
        if (!byUser.has(r.user_id)) byUser.set(r.user_id, new Set())
        byUser.get(r.user_id)!.add(r.trait_key)
      }

      // For each colleague, find their single best match
      const bests: ColleagueBest[] = []
      for (const [userId, traitSet] of byUser.entries()) {
        let bestPct = 0
        let bestMatchName = ''
        let bestShared: string[] = []

        for (const [otherId, otherSet] of byUser.entries()) {
          if (otherId === userId) continue
          const shared = Array.from(traitSet).filter(k => otherSet.has(k))
          const maxSize = Math.max(traitSet.size, otherSet.size)
          if (maxSize === 0) continue
          const pct = Math.round((shared.length / maxSize) * 100)
          if (pct > bestPct || (pct === bestPct && shared.length > bestShared.length)) {
            bestPct = pct
            bestMatchName = userMap.get(otherId) ?? '?'
            bestShared = shared
          }
        }

        if (bestPct > 0) {
          bests.push({
            userName: userMap.get(userId) ?? '?',
            bestMatchName,
            pct: bestPct,
            shared: bestShared,
          })
        }
      }

      bests.sort((a, b) => b.pct - a.pct || b.shared.length - a.shared.length)
      setColleagueBests(bests)

      // Trait stats — all names always shown
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

  if (isLoading || (colleagueBests.length === 0 && traitStats.length === 0)) return null

  return (
    <div className="w-full max-w-sm mx-auto space-y-5 pb-10">

      {/* Colleague best pairs */}
      {colleagueBests.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Trophy size={14} className="text-amber-500" strokeWidth={2.2} />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Colleague Pairs</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {colleagueBests.map((entry, i) => (
              <div key={`${entry.userName}-${i}`} className={cn('px-4 py-3', i > 0 && 'border-t border-gray-50')}>
                <div className="flex items-center justify-between mb-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {entry.userName}
                      <span className="text-gray-400 font-normal"> · best match </span>
                      {entry.bestMatchName}
                    </p>
                  </div>
                  <span className="shrink-0 ml-3 text-sm font-bold text-green-600 tabular-nums">
                    {entry.pct}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed truncate">
                  {entry.shared
                    .map(k => TRAITS.find(t => t.key === k)?.label ?? k)
                    .join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trait breakdown — all names always visible */}
      {traitStats.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <BarChart3 size={14} className="text-violet-500" strokeWidth={2.2} />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Trait Breakdown</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {traitStats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={stat.key} className={cn('px-4 py-3', i > 0 && 'border-t border-gray-50')}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', colorBg[stat.color])}>
                      <Icon size={13} strokeWidth={2.2} className={colorText[stat.color]} />
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-800">{stat.label}</span>
                    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0', colorBadge[stat.color])}>
                      {stat.count}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-10">
                    {stat.names.join(', ')}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
