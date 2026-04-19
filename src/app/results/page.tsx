'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, TrendingUp, Gem, Trophy, Users, ArrowLeft } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { computeMatches, computeGlobalStats } from '@/lib/similarity'
import { MatchResult, GlobalStats } from '@/types'
import DoctorMatch from '@/components/DoctorMatch'
import StatCard from '@/components/StatCard'

export default function ResultsPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('hospital_bingo_user_id')
    const name = localStorage.getItem('hospital_bingo_user_name')

    if (!userId) {
      router.replace('/setup')
      return
    }

    setUserName(name ?? '')

    async function loadData() {
      try {
        const [myResponsesRes, allResponsesRes, allUsersRes] = await Promise.all([
          getSupabase().from('responses').select('trait_key').eq('user_id', userId),
          getSupabase().from('responses').select('user_id, trait_key'),
          getSupabase().from('users').select('id, name, department'),
        ])

        if (myResponsesRes.error) throw myResponsesRes.error
        if (allResponsesRes.error) throw allResponsesRes.error
        if (allUsersRes.error) throw allUsersRes.error

        const myTraits = (myResponsesRes.data ?? []).map((r: { trait_key: string }) => r.trait_key)
        const allResponses = allResponsesRes.data ?? []
        const allUsers = allUsersRes.data ?? []

        const topMatches = computeMatches(userId!, myTraits, allResponses, allUsers)
        const globalStats = computeGlobalStats(allResponses, allUsers)

        setMatches(topMatches)
        setStats(globalStats)
      } catch {
        setError('Could not load results. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
            <Search size={22} className="text-green-400 animate-pulse" />
          </div>
          <p className="text-gray-400 text-sm">Finding your matches…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button onClick={() => window.location.reload()} className="text-green-600 font-medium">
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Your Results{userName ? `, ${userName}` : ''}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Tap a match to see your shared traits</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          Top Matches
        </h2>
        {matches.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mx-auto">
              <Trophy size={20} strokeWidth={2} className="text-green-400" />
            </div>
            <p className="text-gray-400 text-sm">No matches yet — you might be the first one here!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {matches.map((m, i) => (
              <DoctorMatch
                key={m.userId}
                match={m}
                rank={i + 1}
                href={`/results/match/${m.userId}`}
              />
            ))}
          </div>
        )}
      </section>

      {stats && (
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            Hospital Stats
          </h2>
          <div className="space-y-2">
            <StatCard
              icon={TrendingUp}
              label="Most Common Trait"
              value={stats.mostCommonTrait}
              sub={`${stats.mostCommonCount} doctor${stats.mostCommonCount !== 1 ? 's' : ''}`}
            />
            <StatCard
              icon={Gem}
              label="Rarest Trait"
              value={stats.rarestTrait}
              sub={`${stats.rarestCount} doctor${stats.rarestCount !== 1 ? 's' : ''}`}
            />
            <StatCard
              icon={Trophy}
              label="Most Relatable"
              value={stats.mostRelatableDoctor}
            />
            <StatCard
              icon={Users}
              label="Total Participants"
              value={`${stats.totalDoctors} doctor${stats.totalDoctors !== 1 ? 's' : ''}`}
            />
          </div>
        </section>
      )}

      <div className="space-y-3 pb-4">
        <Link
          href="/bingo"
          className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 text-gray-700 font-medium py-3.5 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Edit my board
        </Link>
        <Link href="/" className="block text-center text-sm text-gray-400 hover:text-gray-600">
          Back to home
        </Link>
      </div>
    </div>
  )
}
