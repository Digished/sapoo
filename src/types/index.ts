import { LucideIcon } from 'lucide-react'

export interface Trait {
  key: string
  label: string
  icon: LucideIcon
}

export interface User {
  id: string
  name: string
  department: string | null
  created_at: string
}

export interface Response {
  id: string
  user_id: string
  trait_key: string
  value: boolean
}

export interface MatchResult {
  userId: string
  name: string
  department: string | null
  similarity: number
  sharedTraits: string[]
  sharedCount: number
}

export interface GlobalStats {
  mostCommonTrait: string
  mostCommonCount: number
  rarestTrait: string
  rarestCount: number
  mostRelatableDoctor: string
  totalDoctors: number
}
