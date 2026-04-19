'use client'

import { Trait } from '@/types'
import { cn } from '@/lib/utils'

const MAX_SELECTIONS = 7

interface Props {
  trait: Trait
  isSelected: boolean
  isMaxed: boolean
  onToggle: () => void
}

export default function BingoCard({ trait, isSelected, isMaxed, onToggle }: Props) {
  const Icon = trait.icon
  const disabled = isMaxed && !isSelected

  return (
    <button
      onClick={onToggle}
      aria-pressed={isSelected}
      disabled={disabled}
      className={cn(
        'aspect-square rounded-2xl flex flex-col items-center justify-center text-center gap-1',
        'p-1.5 transition-all duration-200 active:scale-90 select-none',
        isSelected
          ? 'bg-green-500 text-white shadow-md shadow-green-200 scale-[0.97]'
          : disabled
            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
      )}
    >
      <Icon size={18} strokeWidth={isSelected ? 2.5 : 1.8} />
      <span className="text-[9px] leading-tight font-medium w-full px-0.5">
        {trait.label}
      </span>
    </button>
  )
}

export { MAX_SELECTIONS }
