'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { TRAITS } from '@/lib/traits'
import BingoGrid from '@/components/BingoGrid'
import { cn } from '@/lib/utils'

const MAX = 7

export default function BingoPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const lastSavedRef = useRef<Set<string>>(new Set())
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('hospital_bingo_user_id')
    const name = localStorage.getItem('hospital_bingo_user_name')

    if (!id) {
      router.replace('/setup')
      return
    }

    setUserId(id)
    setUserName(name ?? '')

    getSupabase()
      .from('responses')
      .select('trait_key')
      .eq('user_id', id)
      .then(({ data }) => {
        if (data) {
          const keys = new Set(data.map((r: { trait_key: string }) => r.trait_key))
          setSelected(keys)
          lastSavedRef.current = new Set(keys)
        }
        setIsLoading(false)
      })
  }, [router])

  const save = useCallback(
    async (currentSelected: Set<string>, uid: string) => {
      const prev = lastSavedRef.current
      const added = Array.from(currentSelected).filter(k => !prev.has(k))
      const removed = Array.from(prev).filter(k => !currentSelected.has(k))

      if (added.length === 0 && removed.length === 0) return

      setIsSaving(true)

      await Promise.all([
        added.length > 0
          ? getSupabase()
              .from('responses')
              .upsert(added.map(k => ({ user_id: uid, trait_key: k, value: true })))
              .then(() => {})
          : Promise.resolve(),
        removed.length > 0
          ? getSupabase()
              .from('responses')
              .delete()
              .eq('user_id', uid)
              .in('trait_key', removed)
              .then(() => {})
          : Promise.resolve(),
      ])
      lastSavedRef.current = new Set(currentSelected)
      setIsSaving(false)
    },
    []
  )

  const handleToggle = useCallback(
    (key: string) => {
      setSelected(prev => {
        const isRemoving = prev.has(key)
        if (!isRemoving && prev.size >= MAX) return prev

        const next = new Set(prev)
        if (isRemoving) next.delete(key)
        else next.add(key)

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
          if (userId) save(next, userId)
        }, 500)

        return next
      })
    },
    [userId, save]
  )

  const count = selected.size
  const atMax = count >= MAX

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading your board…</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-tight">
              Hi, {userName || 'there'}! 👋
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Pick the traits that describe you</p>
          </div>
          <div className="text-right">
            <div className={cn(
              'text-2xl font-bold tabular-nums leading-none',
              atMax ? 'text-green-500' : 'text-gray-800'
            )}>
              {count}<span className="text-gray-300 text-base font-normal">/{MAX}</span>
            </div>
            <p className={cn(
              'text-[10px] mt-0.5',
              atMax ? 'text-green-500 font-medium' : 'text-gray-400'
            )}>
              {atMax ? 'Board full ✓' : isSaving ? 'Saving…' : 'selected'}
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              atMax ? 'bg-green-500' : 'bg-green-400'
            )}
            style={{ width: `${(count / MAX) * 100}%` }}
          />
        </div>
      </div>

      <BingoGrid traits={TRAITS} selected={selected} onToggle={handleToggle} />

      <div className="px-4 pb-8 pt-4">
        {atMax && (
          <p className="text-center text-xs text-green-600 font-medium mb-3">
            You picked {MAX} traits — ready to see your matches!
          </p>
        )}
        <button
          onClick={() => router.push('/results')}
          disabled={count === 0}
          className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-2xl transition-colors text-base shadow-md shadow-green-200 disabled:shadow-none"
        >
          See My Matches →
        </button>
      </div>
    </div>
  )
}
