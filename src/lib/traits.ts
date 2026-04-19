import { Trait } from '@/types'
import {
  Coffee, Leaf, Moon, Sunrise, BatteryLow,
  Smile, Brain, AlarmClock, CheckCircle2, Clock,
  Home, Users, MessageCircle, VolumeX, Waves,
  Laptop2, Smartphone, Laugh, Share2, Tv2,
  UtensilsCrossed, PartyPopper, Flame, Cookie, Headphones,
} from 'lucide-react'

export const TRAITS: Trait[] = [
  { key: 'coffee_addict',      label: 'Coffee addict',           icon: Coffee },
  { key: 'tea_lover',          label: 'Tea lover',               icon: Leaf },
  { key: 'night_owl',          label: 'Night owl',               icon: Moon },
  { key: 'early_bird',         label: 'Early bird',              icon: Sunrise },
  { key: 'always_tired',       label: 'Always tired',            icon: BatteryLow },
  { key: 'chill_pressure',     label: 'Chill under pressure',    icon: Smile },
  { key: 'overthinks',         label: 'Overthinks everything',   icon: Brain },
  { key: 'last_minute',        label: 'Last-minute worker',      icon: AlarmClock },
  { key: 'very_punctual',      label: 'Very punctual',           icon: CheckCircle2 },
  { key: 'always_late',        label: 'Always late 😅',          icon: Clock },
  { key: 'introvert',          label: 'Introvert',               icon: Home },
  { key: 'extrovert',          label: 'Extrovert',               icon: Users },
  { key: 'talks_group_chat',   label: 'Talks a lot in chats',    icon: MessageCircle },
  { key: 'quiet_irl',          label: 'Quiet in real life',      icon: VolumeX },
  { key: 'go_with_flow',       label: 'Go-with-the-flow',        icon: Waves },
  { key: 'tech_lover',         label: 'Tech lover',              icon: Laptop2 },
  { key: 'always_on_phone',    label: 'Always on phone',         icon: Smartphone },
  { key: 'meme_sender',        label: 'Meme sender',             icon: Laugh },
  { key: 'social_media',       label: 'Social media addict',     icon: Share2 },
  { key: 'netflix_binger',     label: 'Netflix binge watcher',   icon: Tv2 },
  { key: 'foodie',             label: 'Foodie (always hungry)',  icon: UtensilsCrossed },
  { key: 'clown',              label: 'Clown',                   icon: PartyPopper },
  { key: 'spicy_food',         label: 'Loves spicy food',        icon: Flame },
  { key: 'snacks_at_work',     label: 'Snacks during work',      icon: Cookie },
  { key: 'music_is_life',      label: 'Music is life',           icon: Headphones },
]

export const TRAIT_MAP = new Map(TRAITS.map(t => [t.key, t.label]))
