'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'
import { TRAITS } from '@/lib/traits'
import { TraitColor } from '@/types'
import { cn } from '@/lib/utils'

const MAX_RATINGS = 5

const selectedStyles: Record<TraitColor, string> = {
  green:  'bg-green-500  text-white shadow-sm shadow-green-200',
  violet: 'bg-violet-500 text-white shadow-sm shadow-violet-200',
  rose:   'bg-rose-500   text-white shadow-sm shadow-rose-200',
  amber:  'bg-amber-500  text-white shadow-sm shadow-amber-200',
  sky:    'bg-sky-500    text-white shadow-sm shadow-sky-200',
}

interface Props {
  raterId: string
  ratedId: string
}

export default function RatingGrid({ raterId, ratedId }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const lastSavedRef = useRef<Set<string>>(new Set())
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getSupabase()
      .from('ratings')
      .select('trait_key')
      .eq('rater_id', raterId)
      .eq('rated_id', ratedId)
      .then(({ data }) => {
        if (data) {
          const keys = new Set(data.map((r: { trait_key: string }) => r.trait_key))
          setSelected(keys)
          lastSavedRef.current = new Set(keys)
        }
        setIsLoading(false)
      })
  }, [raterId, ratedId])

  const save = useCallback(async (current: Set<string>) => {
    const prev = lastSavedRef.current
    const added = Array.from(current).filter(k => !prev.has(k))
    const removed = Array.from(prev).filter(k => !current.has(k))
    if (added.length === 0 && removed.length === 0) return

    setIsSaving(true)
    await Promise.all([
      added.length > 0
        ? getSupabase()
            .from('ratings')
            .upsert(added.map(k => ({ rater_id: raterId, rated_id: ratedId, trait_key: k })))
            .then(() => {})
        : Promise.resolve(),
      removed.length > 0
        ? getSupabase()
            .from('ratings')
            .delete()
            .eq('rater_id', raterId)
            .eq('rated_id', ratedId)
            .in('trait_key', removed)
            .then(() => {})
        : Promise.resolve(),
    ])
    lastSavedRef.current = new Set(current)
    setIsSaving(false)
  }, [raterId, ratedId])

  const handleToggle = useCallback((key: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else if (next.size >= MAX_RATINGS) return prev
      else next.add(key)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => save(next), 500)
      return next
    })
  }, [save])

  if (isLoading) {
    return <p className="text-gray-400 text-sm text-center py-6">Loading…</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-gray-400">Pick up to 5 traits — saves automatically</p>
        <p className={cn('text-xs font-medium tabular-nums', isSaving ? 'text-gray-400' : selected.size >= MAX_RATINGS ? 'text-green-500' : 'text-gray-400')}>
          {isSaving ? 'Saving…' : `${selected.size}/${MAX_RATINGS}`}
        </p>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {TRAITS.map(trait => {
          const isSelected = selected.has(trait.key)
          const isDisabled = !isSelected && selected.size >= MAX_RATINGS
          const Icon = trait.icon
          return (
            <button
              key={trait.key}
              onClick={() => handleToggle(trait.key)}
              disabled={isDisabled}
              className={cn(
                'aspect-square rounded-2xl flex flex-col items-center justify-center text-center gap-1 p-1.5 select-none transition-all duration-200 active:scale-95',
                isSelected ? selectedStyles[trait.color] : isDisabled ? 'bg-gray-100 text-gray-200' : 'bg-gray-100 text-gray-500'
              )}
            >
              <Icon size={18} strokeWidth={isSelected ? 2.5 : 1.8} />
              <span className="text-[9px] leading-tight font-medium w-full px-0.5">
                {trait.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
