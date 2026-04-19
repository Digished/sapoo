'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'

export default function ProfilePage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('hospital_bingo_user_id')
    const n  = localStorage.getItem('hospital_bingo_user_name')
    if (!id) { router.replace('/setup'); return }
    setUserId(id)
    setName(n ?? '')

    getSupabase()
      .from('users')
      .select('pin')
      .eq('id', id)
      .single()
      .then(({ data }) => { if (data?.pin) setPin(data.pin) })
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !userId) return
    setIsSaving(true)
    setError(null)
    setSaved(false)

    const { error: err } = await getSupabase()
      .from('users')
      .update({ name: name.trim() })
      .eq('id', userId)

    if (err) {
      setError('Could not save. Try again.')
    } else {
      localStorage.setItem('hospital_bingo_user_name', name.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
    setIsSaving(false)
  }

  return (
    <div className="flex flex-col flex-1 px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/bingo"
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0"
        >
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            minLength={2}
            maxLength={60}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-base"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Your PIN</label>
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              readOnly
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-500 text-base tracking-widest pr-12 cursor-default"
            />
            <button
              type="button"
              onClick={() => setShowPin(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-400">PIN is read-only. Use it to sign back in.</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSaving || !name.trim()}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-2xl transition-colors text-base shadow-md shadow-green-200 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {saved
            ? <><CheckCircle2 size={18} /> Saved</>
            : isSaving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
