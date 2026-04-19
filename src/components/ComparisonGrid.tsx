import { TRAITS } from '@/lib/traits'
import { cn } from '@/lib/utils'

interface Props {
  myTraits: Set<string>
  theirTraits: Set<string>
}

export default function ComparisonGrid({ myTraits, theirTraits }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs text-gray-500 px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
          Both of you
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-indigo-100 border border-indigo-200 inline-block" />
          Only them
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-100 inline-block" />
          Neither
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {TRAITS.map(trait => {
          const mine = myTraits.has(trait.key)
          const theirs = theirTraits.has(trait.key)
          const shared = mine && theirs
          const theirOnly = !mine && theirs

          const Icon = trait.icon

          return (
            <div
              key={trait.key}
              className={cn(
                'aspect-square rounded-2xl flex flex-col items-center justify-center text-center gap-1 p-1.5 select-none',
                shared
                  ? 'bg-green-500 text-white shadow-md shadow-green-200'
                  : theirOnly
                    ? 'bg-indigo-50 text-indigo-400 border border-indigo-100'
                    : 'bg-gray-100 text-gray-300'
              )}
            >
              <Icon size={18} strokeWidth={shared ? 2.5 : 1.8} />
              <span className="text-[9px] leading-tight font-medium w-full px-0.5">
                {trait.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
