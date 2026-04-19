import Link from 'next/link'
import { Hospital, CheckCircle2, Users, BarChart3, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500 shadow-lg shadow-green-200">
            <Hospital size={32} strokeWidth={1.8} className="text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              Hospital Truth<br />Bingo
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Doctors&apos; Day Edition — pick your traits<br />and find your hospital twin
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {[
            { icon: CheckCircle2, text: 'Pick 10 traits that describe you' },
            { icon: Users,         text: 'See which colleagues you match' },
            { icon: BarChart3,     text: 'Explore fun hospital-wide stats' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3.5 px-5 py-3.5">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <Icon size={16} strokeWidth={2} className="text-green-500" />
              </div>
              <span className="text-sm text-gray-600">{text}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Link
            href="/setup"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-4 rounded-2xl transition-colors shadow-md shadow-green-200"
          >
            Let&apos;s Play
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <p className="text-center text-xs text-gray-400">No login required · Takes 2 minutes</p>
        </div>

      </div>
    </div>
  )
}
