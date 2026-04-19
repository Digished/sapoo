import { Trait } from '@/types'

export const TRAITS: Trait[] = [
  { key: 'coffee_addict',         label: 'Coffee Addict' },
  { key: 'fell_asleep_on_call',   label: 'Fell asleep on call' },
  { key: 'hates_ward_rounds',     label: 'Hates ward rounds' },
  { key: 'loves_night_shifts',    label: 'Loves night shifts' },
  { key: 'prefers_surgery',       label: 'Prefers surgery' },
  { key: 'prefers_medicine',      label: 'Prefers medicine' },
  { key: 'uses_uptodate_daily',   label: 'Uses UpToDate daily' },
  { key: 'lost_stethoscope',      label: 'Lost stethoscope' },
  { key: 'always_hungry_on_call', label: 'Always hungry on call' },
  { key: 'skipped_lunch',         label: 'Skipped lunch today' },
  { key: 'meme_sender',           label: 'Meme sender in group chat' },
  { key: 'early_bird',            label: 'Early bird' },
  { key: 'night_owl',             label: 'Night owl' },
  { key: 'burnt_out_intern',      label: 'Burnt out intern' },
  { key: 'calm_under_pressure',   label: 'Calm under pressure' },
  { key: 'loves_teaching',        label: 'Loves teaching juniors' },
  { key: 'avoids_phone_calls',    label: 'Avoids phone calls' },
  { key: 'notes_last_minute',     label: 'Notes last minute' },
  { key: 'enjoys_icu',            label: 'Enjoys ICU' },
  { key: 'enjoys_pediatrics',     label: 'Enjoys pediatrics' },
  { key: 'drinks_tea',            label: 'Tea > Coffee' },
  { key: 'works_overtime',        label: 'Works overtime often' },
  { key: 'forgets_lunch',         label: 'Forgets lunch often' },
  { key: 'loves_jollof_rice',     label: 'Loves jollof rice' },
  { key: 'medical_youtube',       label: 'Watches medical YouTube' },
]

export const TRAIT_MAP = new Map(TRAITS.map(t => [t.key, t.label]))
