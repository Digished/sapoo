'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import { TRAITS } from '@/lib/traits'
import { TraitColor } from '@/types'
import { cn } from '@/lib/utils'

interface RatingRow { rater_id: string; trait_key: string }
interface Rater { id: string; name: string }

const selectedStyles: Record<TraitColor, string> = {
  green:  'bg-green-500  text-white shadow-sm shadow-green-200',
  violet: 'bg-violet-500 text-white shadow-sm shadow-violet-200',
  rose:   'bg-rose-500   text-white shadow-sm shadow-rose-200',
  amber:  'bg-amber-500  text-white shadow-sm shadow-amber-200',
  sky:    'bg-sky-500    text-white shadow-sm shadow-sky-200',
}

export default function PeerView({ userId }: { userId: string }) {
  const [ratings, setRatings] = useState<RatingRow[]>([])
  const [raters, setRaters] = useState<Rater[]>([])
  const [selectedRater, setSelectedRater] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await getSupabase()
        .from('ratings')
        .select('rater_id, trait_key')
        .eq('rated_id', userId)

      if (!data || data.length === 0) { setIsLoading(false); return }

      setRatings(data)

      const raterIds = Array.from(new Set(data.map((r: RatingRow) => r.rater_id)))
      const { data: users } = await getSupabase()
        .from('users')
        .select('id, name')
        .in('id', raterIds)

      if (users) setRaters(users)
      setIsLoading(false)
    }
    load()
  }, [userId])

  // Aggregate counts
  const traitCounts = new Map<string, number>()
  const traitRaterSets = new Map<string, Set<string>>()
  for (const r of ratings) {
    traitCounts.set(r.trait_key, (traitCounts.get(r.trait_key) ?? 0) + 1)
    if (!traitRaterSets.has(r.trait_key)) traitRaterSets.set(r.trait_key, new Set())
    traitRaterSets.get(r.trait_key)!.add(r.rater_id)
  }

  const activeTraits = selectedRater
    ? new Set(ratings.filter(r => r.rater_id === selectedRater).map(r => r.trait_key))
    : new Set(ratings.map(r => r.trait_key))

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    )
  }

  if (ratings.length === 0) {
    return (
      <div className="px-4 pt-2">
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm">No one has rated you yet — go see your colleagues!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Rater filter pills */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSelectedRater(null)}
          className={cn(
            'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
            selectedRater === null
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          )}
        >
          Everyone · {raters.length}
        </button>
        {raters.map(rater => (
          <button
            key={rater.id}
            onClick={() => setSelectedRater(prev => prev === rater.id ? null : rater.id)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              selectedRater === rater.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            )}
          >
            {rater.name}
          </button>
        ))}
      </div>

      {/* Trait grid */}
      <div className="grid grid-cols-5 gap-1.5 px-2">
        {TRAITS.map(trait => {
          const isActive = activeTraits.has(trait.key)
          const totalCount = traitCounts.get(trait.key) ?? 0
          const Icon = trait.icon

          return (
            <div
              key={trait.key}
              className={cn(
                'aspect-square rounded-2xl flex flex-col items-center justify-center text-center gap-1 p-1.5 select-none relative',
                isActive ? selectedStyles[trait.color] : 'bg-gray-100 text-gray-300'
              )}
            >
              {!selectedRater && totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-white border border-gray-200 rounded-full text-[9px] font-bold text-gray-700 flex items-center justify-center px-1 shadow-sm z-10">
                  {totalCount}
                </span>
              )}
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[9px] leading-tight font-medium w-full px-0.5">
                {trait.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
