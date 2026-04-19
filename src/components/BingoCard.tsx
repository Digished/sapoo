'use client'

import { Trait } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  trait: Trait
  isSelected: boolean
  onToggle: () => void
}

export default function BingoCard({ trait, isSelected, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={isSelected}
      className={cn(
        'aspect-square rounded-xl flex items-center justify-center text-center',
        'text-[11px] leading-tight font-medium p-1.5',
        'transition-all duration-200 active:scale-90 select-none',
        isSelected
          ? 'bg-green-500 text-white shadow-md shadow-green-200 scale-[0.97]'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      )}
    >
      {trait.label}
    </button>
  )
}
