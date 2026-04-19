'use client'

import { Trait, TraitColor } from '@/types'
import { cn } from '@/lib/utils'

export const MAX_SELECTIONS = 7

const selectedStyles: Record<TraitColor, string> = {
  green:  'bg-green-500  shadow-green-200  text-white',
  violet: 'bg-violet-500 shadow-violet-200 text-white',
  rose:   'bg-rose-500   shadow-rose-200   text-white',
  amber:  'bg-amber-500  shadow-amber-200  text-white',
  sky:    'bg-sky-500    shadow-sky-200    text-white',
}

const hoverStyles: Record<TraitColor, string> = {
  green:  'hover:bg-green-50  hover:text-green-600',
  violet: 'hover:bg-violet-50 hover:text-violet-600',
  rose:   'hover:bg-rose-50   hover:text-rose-600',
  amber:  'hover:bg-amber-50  hover:text-amber-600',
  sky:    'hover:bg-sky-50    hover:text-sky-600',
}

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
          ? `${selectedStyles[trait.color]} shadow-md scale-[0.97]`
          : disabled
            ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
            : `bg-gray-100 text-gray-400 ${hoverStyles[trait.color]}`
      )}
    >
      <Icon size={18} strokeWidth={isSelected ? 2.5 : 1.8} />
      <span className="text-[9px] leading-tight font-medium w-full px-0.5">
        {trait.label}
      </span>
    </button>
  )
}
