'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { TRAITS } from '@/lib/traits'
import BingoGrid from '@/components/BingoGrid'

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
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading your board…</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="px-4 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900 text-lg">
            Hi, {userName || 'Doctor'}! 👋
          </h1>
          <p className="text-sm text-gray-500">Tap the traits that apply to you</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-green-500">{selected.size}</span>
          <span className="text-gray-400 text-sm">/25</span>
          {isSaving && <p className="text-xs text-gray-400">Saving…</p>}
        </div>
      </div>

      <BingoGrid traits={TRAITS} selected={selected} onToggle={handleToggle} />

      <div className="px-4 pb-8 pt-3">
        <button
          onClick={() => router.push('/results')}
          className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-4 rounded-2xl transition-colors text-lg shadow-md shadow-green-200"
        >
          See Results →
        </button>
        {selected.size === 0 && (
          <p className="text-center text-xs text-gray-400 mt-2">
            Select at least one trait first
          </p>
        )}
      </div>
    </div>
  )
}
