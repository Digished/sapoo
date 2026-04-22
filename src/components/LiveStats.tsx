'use client'

import { useEffect, useState } from 'react'
import { Trophy, BarChart3, X } from 'lucide-react'
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

const colorSelected: Record<TraitColor, string> = {
  green:  'bg-green-500  text-white',
  violet: 'bg-violet-500 text-white',
  rose:   'bg-rose-500   text-white',
  amber:  'bg-amber-500  text-white',
  sky:    'bg-sky-500    text-white',
}

export default function LiveStats() {
  const [pairs, setPairs]           = useState<Pair[]>([])
  const [traitStats, setTraitStats] = useState<TraitStat[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [activePair, setActivePair] = useState<Pair | null>(null)

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

      // Each user's best match, deduplicated as combinations
      const seen = new Set<string>()
      const computed: Pair[] = []

      for (const [userId, traitSet] of byUser.entries()) {
        let bestPct = 0, bestId = '', bestShared: string[] = []

        for (const [otherId, otherSet] of byUser.entries()) {
          if (otherId === userId) continue
          const shared = Array.from(traitSet).filter(k => otherSet.has(k))
          if (shared.length === 0) continue
          const maxSize = Math.max(traitSet.size, otherSet.size)
          const pct = Math.round((shared.length / maxSize) * 100)
          if (pct > bestPct || (pct === bestPct && shared.length > bestShared.length)) {
            bestPct = pct; bestId = otherId; bestShared = shared
          }
        }

        if (!bestId) continue
        // Canonical key so A&B and B&A are the same
        const key = [userId, bestId].sort().join('|')
        if (seen.has(key)) continue
        seen.add(key)
        computed.push({
          aName: userMap.get(userId) ?? '?',
          bName: userMap.get(bestId) ?? '?',
          pct: bestPct,
          shared: bestShared,
        })
      }

      computed.sort((a, b) => b.pct - a.pct || b.shared.length - a.shared.length)
      setPairs(computed)

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

  if (isLoading || (pairs.length === 0 && traitStats.length === 0)) return null

  return (
    <>
      <div className="w-full max-w-sm mx-auto space-y-5 pb-10">

        {/* Colleague pairs */}
        {pairs.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Trophy size={14} className="text-amber-500" strokeWidth={2.2} />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Colleague Pairs</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {pairs.map((pair, i) => (
                <button
                  key={`${pair.aName}-${pair.bName}`}
                  onClick={() => setActivePair(pair)}
                  className={cn(
                    'w-full text-left px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors',
                    i > 0 && 'border-t border-gray-50'
                  )}
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {pair.aName}
                    <span className="text-gray-400 font-normal"> &amp; </span>
                    {pair.bName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {pair.shared.map(k => TRAITS.find(t => t.key === k)?.label ?? k).join(' · ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trait breakdown */}
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

      {/* Pair modal */}
      {activePair && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setActivePair(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <div>
                <p className="text-base font-bold text-gray-900">
                  {activePair.aName} &amp; {activePair.bName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activePair.shared.length} shared trait{activePair.shared.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setActivePair(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Shared traits */}
            <div className="px-5 pb-6 flex flex-wrap gap-2">
              {activePair.shared.map(key => {
                const trait = TRAITS.find(t => t.key === key)
                if (!trait) return null
                const Icon = trait.icon
                return (
                  <span
                    key={key}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                      colorSelected[trait.color]
                    )}
                  >
                    <Icon size={12} strokeWidth={2.5} />
                    {trait.label}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
