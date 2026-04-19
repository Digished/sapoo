'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import ComparisonGrid from '@/components/ComparisonGrid'

export default function MatchPage() {
  const router = useRouter()
  const params = useParams()
  const otherUserId = params.userId as string

  const [myTraits, setMyTraits] = useState<Set<string>>(new Set())
  const [theirTraits, setTheirTraits] = useState<Set<string>>(new Set())
  const [theirName, setTheirName] = useState('')
  const [similarity, setSimilarity] = useState(0)
  const [sharedCount, setSharedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const myId = localStorage.getItem('hospital_bingo_user_id')
    if (!myId) {
      router.replace('/setup')
      return
    }

    async function load() {
      try {
        const [myRes, theirRes, userRes] = await Promise.all([
          getSupabase().from('responses').select('trait_key').eq('user_id', myId),
          getSupabase().from('responses').select('trait_key').eq('user_id', otherUserId),
          getSupabase().from('users').select('name').eq('id', otherUserId).single(),
        ])

        if (myRes.error) throw myRes.error
        if (theirRes.error) throw theirRes.error

        const mine = new Set((myRes.data ?? []).map((r: { trait_key: string }) => r.trait_key))
        const theirs = new Set((theirRes.data ?? []).map((r: { trait_key: string }) => r.trait_key))

        const shared = Array.from(mine).filter(k => theirs.has(k)).length
        const maxSize = Math.max(mine.size, theirs.size)
        const pct = maxSize > 0 ? Math.round((shared / maxSize) * 100) : 0

        setMyTraits(mine)
        setTheirTraits(theirs)
        setTheirName(userRes.data?.name ?? 'This person')
        setSimilarity(pct)
        setSharedCount(shared)
      } catch {
        setError('Could not load comparison.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [router, otherUserId])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading comparison…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 text-center space-y-3">
        <p className="text-red-400 text-sm">{error}</p>
        <Link href="/results" className="text-green-600 text-sm font-medium">← Back</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 px-4 py-5 space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/results" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-bold text-gray-900 text-lg leading-tight truncate">
            You &amp; {theirName}
          </h1>
          <p className="text-xs text-gray-400">{sharedCount} shared trait{sharedCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="ml-auto shrink-0 text-right">
          <p className="text-2xl font-bold text-green-500 tabular-nums leading-none">{similarity}%</p>
          <p className="text-xs text-gray-400">match</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
          <Users size={18} strokeWidth={2} className="text-green-500" />
        </div>
        <p className="text-sm text-gray-600">
          Green squares are traits you both chose. Tap back to see all your matches.
        </p>
      </div>

      <ComparisonGrid myTraits={myTraits} theirTraits={theirTraits} />

      <div className="pb-4">
        <Link
          href="/results"
          className="block w-full text-center bg-white border border-gray-200 text-gray-700 font-medium py-3.5 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          ← Back to results
        </Link>
      </div>
    </div>
  )
}
