import { MatchResult, GlobalStats } from '@/types'
import { TRAIT_MAP } from '@/lib/traits'

interface RawResponse {
  user_id: string
  trait_key: string
}

interface UserRecord {
  id: string
  name: string
  department: string | null
}

export function computeMatches(
  currentUserId: string,
  currentUserTraits: string[],
  allResponses: RawResponse[],
  allUsers: UserRecord[]
): MatchResult[] {
  const byUser = new Map<string, Set<string>>()
  for (const r of allResponses) {
    if (r.user_id === currentUserId) continue
    if (!byUser.has(r.user_id)) byUser.set(r.user_id, new Set())
    byUser.get(r.user_id)!.add(r.trait_key)
  }

  const currentSet = new Set(currentUserTraits)
  const userMap = new Map(allUsers.map(u => [u.id, u]))
  const results: MatchResult[] = []

  for (const [otherId, otherSet] of byUser.entries()) {
    const user = userMap.get(otherId)
    if (!user) continue

    const shared = Array.from(currentSet).filter(k => otherSet.has(k))
    const unionSize = Math.max(currentSet.size, otherSet.size)
    if (unionSize === 0) continue

    const similarity = Math.round((shared.length / unionSize) * 100)
    results.push({
      userId: otherId,
      name: user.name,
      department: user.department,
      similarity,
      sharedTraits: shared,
      sharedCount: shared.length,
    })
  }

  return results
    .sort((a, b) => b.similarity - a.similarity || b.sharedCount - a.sharedCount)
}

export function computeGlobalStats(
  allResponses: RawResponse[],
  allUsers: UserRecord[]
): GlobalStats {
  const traitCounts = new Map<string, number>()
  for (const r of allResponses) {
    traitCounts.set(r.trait_key, (traitCounts.get(r.trait_key) ?? 0) + 1)
  }

  const sorted = Array.from(traitCounts.entries()).sort((a, b) => b[1] - a[1])
  const mostCommon = sorted[0] ?? ['—', 0]
  const rarest = sorted[sorted.length - 1] ?? ['—', 0]

  const responsesByUser = new Map<string, number>()
  for (const r of allResponses) {
    responsesByUser.set(r.user_id, (responsesByUser.get(r.user_id) ?? 0) + 1)
  }
  const mostRelatableId = Array.from(responsesByUser.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]
  const mostRelatable = allUsers.find(u => u.id === mostRelatableId)

  return {
    mostCommonTrait: TRAIT_MAP.get(mostCommon[0]) ?? mostCommon[0],
    mostCommonCount: mostCommon[1],
    rarestTrait: TRAIT_MAP.get(rarest[0]) ?? rarest[0],
    rarestCount: rarest[1],
    mostRelatableDoctor: mostRelatable?.name ?? '—',
    totalDoctors: new Set(allResponses.map(r => r.user_id)).size,
  }
}
