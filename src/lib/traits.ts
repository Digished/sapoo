import { Trait } from '@/types'
import {
  Coffee, PawPrint, Moon, Sunrise, BatteryLow,
  Smile, Brain, Heart, Pizza, Mic2,
  Home, Users, MessageCircle, Meh, ShieldCheck,
  Code2, Smartphone, Laugh, Share2, Tv2,
  UtensilsCrossed, PartyPopper, Gamepad2, PhoneOff, Music2,
} from 'lucide-react'

export const TRAITS: Trait[] = [
  { key: 'coffee_addict',       label: 'Coffee addict',             icon: Coffee,           color: 'amber'  },
  { key: 'dog_person',          label: 'Dog person',                icon: PawPrint,         color: 'rose'   },
  { key: 'night_owl',           label: 'Night owl',                 icon: Moon,             color: 'violet' },
  { key: 'early_bird',          label: 'Early bird',                icon: Sunrise,          color: 'amber'  },
  { key: 'always_tired',        label: 'Always tired',              icon: BatteryLow,       color: 'sky'    },
  { key: 'chill_pressure',      label: 'Chill under pressure',      icon: Smile,            color: 'green'  },
  { key: 'overthinks',          label: 'Overthinks everything',     icon: Brain,            color: 'violet' },
  { key: 'big_hugger',          label: 'Big hugger',                icon: Heart,            color: 'rose'   },
  { key: 'junk_food',           label: 'Junk food lover',           icon: Pizza,            color: 'amber'  },
  { key: 'sings_shower',        label: 'Sings in the shower',       icon: Mic2,             color: 'sky'    },
  { key: 'introvert',           label: 'Introvert until comfortable', icon: Home,           color: 'green'  },
  { key: 'extrovert',           label: 'Extrovert everywhere',      icon: Users,            color: 'violet' },
  { key: 'group_chat_talker',   label: 'Group chat over-talker',    icon: MessageCircle,    color: 'rose'   },
  { key: 'gets_bored',          label: 'Gets bored easily',         icon: Meh,              color: 'amber'  },
  { key: 'hard_to_offend',      label: 'Hard to offend',            icon: ShieldCheck,      color: 'sky'    },
  { key: 'tech_nerd',           label: 'Tech nerd',                 icon: Code2,            color: 'green'  },
  { key: 'always_on_phone',     label: 'Always on phone',           icon: Smartphone,       color: 'violet' },
  { key: 'meme_dealer',         label: 'Certified meme dealer',     icon: Laugh,            color: 'rose'   },
  { key: 'social_media',        label: 'Social media addict',       icon: Share2,           color: 'amber'  },
  { key: 'netflix_junkie',      label: 'Netflix junkie',            icon: Tv2,              color: 'sky'    },
  { key: 'always_hungry',       label: 'Always hungry',             icon: UtensilsCrossed,  color: 'green'  },
  { key: 'class_clown',         label: 'Class clown',               icon: PartyPopper,      color: 'violet' },
  { key: 'video_games',         label: 'Video Games Please',        icon: Gamepad2,         color: 'rose'   },
  { key: 'dont_call_text',      label: "Don't call, just text",     icon: PhoneOff,         color: 'amber'  },
  { key: 'can_dance',           label: 'Can dance for Africa',      icon: Music2,           color: 'sky'    },
]

export const TRAIT_MAP = new Map(TRAITS.map(t => [t.key, t.label]))
