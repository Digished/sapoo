'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export default function SetupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    setError(null)

    const { data, error: insertError } = await getSupabase()
      .from('users')
      .insert({ name: name.trim(), department: null })
      .select('id')
      .single()

    if (insertError || !data) {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
      return
    }

    localStorage.setItem('hospital_bingo_user_id', data.id)
    localStorage.setItem('hospital_bingo_user_name', name.trim())

    router.push('/bingo')
  }

  return (
    <div className="flex flex-col flex-1 px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">What&apos;s your name?</h1>
        <p className="text-gray-500 text-sm mt-1">No account needed — just your name</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Amina"
            required
            minLength={2}
            maxLength={60}
            autoFocus
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-base"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-2xl transition-colors text-lg shadow-md shadow-green-200 disabled:shadow-none"
          >
            {isSubmitting ? 'Setting up…' : 'Continue →'}
          </button>
        </div>
      </form>
    </div>
  )
}
