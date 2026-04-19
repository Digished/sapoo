import { Trait } from '@/types'
import BingoCard, { MAX_SELECTIONS } from './BingoCard'

interface Props {
  traits: Trait[]
  selected: Set<string>
  onToggle: (key: string) => void
}

export default function BingoGrid({ traits, selected, onToggle }: Props) {
  const isMaxed = selected.size >= MAX_SELECTIONS

  return (
    <div className="grid grid-cols-5 gap-1.5 px-2">
      {traits.map(trait => (
        <BingoCard
          key={trait.key}
          trait={trait}
          isSelected={selected.has(trait.key)}
          isMaxed={isMaxed}
          onToggle={() => onToggle(trait.key)}
        />
      ))}
    </div>
  )
}
