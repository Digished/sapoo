import Link from 'next/link'
import { Stethoscope, CheckSquare, Users, ArrowRight } from 'lucide-react'
import BingoPreview from '@/components/BingoPreview'
import LiveStats from '@/components/LiveStats'

export default function Home() {
  return (
    <div className="flex flex-col items-center flex-1 px-6 py-14 relative overflow-hidden">

      {/* Animated background grid */}
      <div className="absolute inset-0 flex items-start justify-center pointer-events-none select-none" aria-hidden>
        <div className="w-full max-w-sm px-6 pt-8 opacity-[0.13]">
          <BingoPreview />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
      </div>

      <div className="w-full max-w-sm space-y-10 relative z-10">

        {/* Hero */}
        <div className="text-center space-y-5 animate-fade-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-500 shadow-xl shadow-green-200 animate-float">
            <Stethoscope size={38} strokeWidth={1.6} className="text-white" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest text-green-500 uppercase">
              Happy Doctors&apos; Day
            </p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-none">
              Harvey Twin
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
              Pick your traits and find your hospital twin
            </p>
          </div>
        </div>

        {/* Feature list */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-up-1">
          {[
            { icon: CheckSquare, text: 'Pick 10 traits that describe you' },
            { icon: Users,       text: 'Find colleagues who match your vibe' },
          ].map(({ icon: Icon, text }, i) => (
            <div
              key={text}
              className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? 'border-t border-gray-50' : ''}`}
            >
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <Icon size={15} strokeWidth={2.2} className="text-green-500" />
              </div>
              <span className="text-sm text-gray-600 font-medium">{text}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-3 animate-fade-up-2">
          <Link
            href="/setup"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-4 rounded-2xl transition-colors shadow-lg shadow-green-200 text-base"
          >
            Get Started
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <Link
            href="/setup?mode=signin"
            className="flex items-center justify-center w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-3.5 rounded-2xl transition-colors text-sm"
          >
            Already joined? Sign back in
          </Link>
        </div>

      </div>

      {/* Live leaderboard — loads after CTAs, outside the z-10 hero container */}
      <div className="w-full relative z-10 mt-10">
        <LiveStats />
      </div>

    </div>
  )
}
