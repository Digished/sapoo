import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="space-y-2">
          <div className="text-5xl mb-4">🏥</div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Hospital Truth<br />Bingo
          </h1>
          <p className="text-gray-500 text-sm">
            Doctors&apos; Day Edition — tap the traits that describe you and see who you match with
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="text-lg">✅</span>
            <span>Pick traits that apply to <strong>you</strong></span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="text-lg">👯</span>
            <span>See which colleagues you match with</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="text-lg">📊</span>
            <span>Discover fun hospital-wide stats</span>
          </div>
        </div>

        <Link
          href="/setup"
          className="block w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-4 rounded-2xl transition-colors text-lg shadow-md shadow-green-200"
        >
          Let&apos;s Play →
        </Link>

        <p className="text-xs text-gray-400">No login required · Takes 2 minutes</p>
      </div>
    </div>
  )
}
