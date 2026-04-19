'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, ChevronDown, CheckCircle2 } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type Mode = 'new' | 'returning' | 'pin-saved'

interface ExistingUser { id: string; name: string }

export default function SetupPage() {
  return (
    <Suspense>
      <SetupContent />
    </Suspense>
  )
}

function SetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signin' ? 'returning' : 'new'

  const [mode, setMode] = useState<Mode>(initialMode)
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [allUsers, setAllUsers] = useState<ExistingUser[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedUser, setSelectedUser] = useState<ExistingUser | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Fetch all existing names on mount
  useEffect(() => {
    getSupabase()
      .from('users')
      .select('id, name')
      .order('name')
      .then(({ data }) => { if (data) setAllUsers(data) })
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = name.trim().length > 0
    ? allUsers.filter(u => u.name.toLowerCase().includes(name.toLowerCase())).slice(0, 6)
    : []

  function selectUser(user: ExistingUser) {
    setSelectedUser(user)
    setName(user.name)
    setMode('returning')
    setShowDropdown(false)
    setError(null)
  }

  function handleNameChange(value: string) {
    setName(value)
    setShowDropdown(true)
    // If user clears selection by typing differently
    if (selectedUser && value !== selectedUser.name) {
      setSelectedUser(null)
      setMode('new')
    }
  }

  // Generate a random 4-digit PIN
  function generatePin() {
    return String(Math.floor(1000 + Math.random() * 9000))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setIsSubmitting(true)
    setError(null)

    if (mode === 'returning') {
      // Verify existing user + PIN
      const { data, error: err } = await getSupabase()
        .from('users')
        .select('id, name')
        .eq('id', selectedUser!.id)
        .eq('pin', pin)
        .single()

      if (err || !data) {
        setError('Incorrect PIN. Try again.')
        setIsSubmitting(false)
        return
      }

      localStorage.setItem('hospital_bingo_user_id', data.id)
      localStorage.setItem('hospital_bingo_user_name', data.name)
      router.push('/bingo')
      return
    }

    // New user — create account with auto-generated PIN
    const generatedPin = generatePin()
    const { data, error: insertError } = await getSupabase()
      .from('users')
      .insert({ name: name.trim(), department: null, pin: generatedPin })
      .select('id')
      .single()

    if (insertError || !data) {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
      return
    }

    localStorage.setItem('hospital_bingo_user_id', data.id)
    localStorage.setItem('hospital_bingo_user_name', name.trim())
    setNewPin(generatedPin)
    setMode('pin-saved')
    setIsSubmitting(false)
  }

  // PIN confirmation screen
  if (mode === 'pin-saved') {
    return (
      <div className="flex flex-col flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} strokeWidth={1.8} className="text-green-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">You&apos;re in!</h1>
            <p className="text-gray-500 text-sm">Save your PIN to sign back in later</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Your PIN</p>
            <p className="text-4xl font-bold tracking-widest text-gray-900">{newPin}</p>
            <p className="text-xs text-gray-400">Screenshot this screen</p>
          </div>

          <button
            onClick={() => router.push('/bingo')}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-4 rounded-2xl transition-colors text-base shadow-md shadow-green-200"
          >
            Go to my board →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'returning' ? 'Welcome back!' : 'Join Harvey Twin'}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {mode === 'returning' ? 'Enter your PIN to continue' : 'Choose a name to get started'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1" autoComplete="off">
        {/* Name field with dropdown */}
        <div className="space-y-1.5" ref={dropdownRef}>
          <label className="text-sm font-medium text-gray-700" htmlFor="name">
            Your name
          </label>
          <div className="relative">
            <input
              ref={nameInputRef}
              id="name"
              type="text"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              onFocus={() => name.trim() && setShowDropdown(true)}
              placeholder="Type your name…"
              required
              minLength={2}
              maxLength={60}
              autoComplete="off"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-base"
            />
            {selectedUser && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 size={18} className="text-green-500" />
              </div>
            )}

            {/* Dropdown */}
            {showDropdown && filtered.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                <p className="px-4 py-2 text-[11px] text-gray-400 uppercase tracking-wide font-medium border-b border-gray-50">
                  Existing participants
                </p>
                {filtered.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onMouseDown={() => selectUser(user)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                  >
                    {user.name}
                    <ChevronDown size={14} className="text-gray-300 -rotate-90" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PIN field — only for returning users */}
        {mode === 'returning' && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700" htmlFor="pin">
              Enter your PIN
            </label>
            <div className="relative">
              <input
                id="pin"
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                required
                minLength={4}
                maxLength={4}
                inputMode="numeric"
                pattern="[0-9]{4}"
                autoFocus
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-base tracking-widest pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPin(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || (mode === 'returning' && pin.length < 4)}
            className={cn(
              'w-full font-semibold py-4 rounded-2xl transition-colors text-base shadow-md disabled:shadow-none',
              mode === 'returning'
                ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-green-200 disabled:bg-gray-200 disabled:text-gray-400'
                : 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-green-200 disabled:bg-gray-200 disabled:text-gray-400'
            )}
          >
            {isSubmitting
              ? 'Loading…'
              : mode === 'returning'
                ? 'Sign in →'
                : 'Create account →'}
          </button>
        </div>

        {mode !== 'returning' && (
          <p className="text-center text-xs text-gray-400 pt-1">
            Already joined?{' '}
            <button
              type="button"
              className="text-green-600 font-medium"
              onClick={() => { setMode('returning'); setPin(''); setError(null) }}
            >
              Sign back in
            </button>
          </p>
        )}
      </form>
    </div>
  )
}
