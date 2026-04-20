'use client'

import { useEffect, useState } from 'react'
import { TRAITS } from '@/lib/traits'
import { cn } from '@/lib/utils'

const GRID_SIZE = 40
const MAX_SELECTED = 6
const TOGGLE_INTERVAL = 950

export default function BingoPreview() {
  const [selected, setSelected] = useState<Set<number>>(new Set([2, 7, 11, 18, 22]))

  useEffect(() => {
    const id = setInterval(() => {
      setSelected(prev => {
        const next = new Set(prev)
        if (next.size >= MAX_SELECTED) {
          // Deselect a random selected square
          const arr = Array.from(next)
          next.delete(arr[Math.floor(Math.random() * arr.length)])
        } else {
          // Select a random unselected square
          const unselected = Array.from({ length: GRID_SIZE }, (_, i) => i).filter(i => !next.has(i))
          if (unselected.length > 0) {
            next.add(unselected[Math.floor(Math.random() * unselected.length)])
          }
        }
        return next
      })
    }, TOGGLE_INTERVAL)
    return () => clearInterval(id)
  }, [])

  const colorMap: Record<string, string> = {
    green:  'bg-green-400',
    violet: 'bg-violet-400',
    rose:   'bg-rose-400',
    amber:  'bg-amber-400',
    sky:    'bg-sky-400',
  }

  return (
    <div className="grid grid-cols-5 gap-1.5 w-full">
      {TRAITS.map((trait, i) => {
        const isSelected = selected.has(i)
        const Icon = trait.icon
        return (
          <div
            key={trait.key}
            className={cn(
              'aspect-square rounded-lg flex items-center justify-center transition-all duration-500',
              isSelected
                ? colorMap[trait.color]
                : 'bg-gray-900/5'
            )}
          >
            <Icon
              size={14}
              strokeWidth={2}
              className={cn(
                'transition-all duration-500',
                isSelected ? 'text-white opacity-90' : 'text-gray-400 opacity-40'
              )}
            />
          </div>
        )
      })}
    </div>
  )
}
