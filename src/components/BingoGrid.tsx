import { Trait } from '@/types'
import BingoCard from './BingoCard'

interface Props {
  traits: Trait[]
  selected: Set<string>
  onToggle: (key: string) => void
}

export default function BingoGrid({ traits, selected, onToggle }: Props) {
  return (
    <div className="grid grid-cols-5 gap-1.5 p-2">
      {traits.map(trait => (
        <BingoCard
          key={trait.key}
          trait={trait}
          isSelected={selected.has(trait.key)}
          onToggle={() => onToggle(trait.key)}
        />
      ))}
    </div>
  )
}
