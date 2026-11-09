export type Element = 'Hỏa' | 'Mộc' | 'Thủy' | 'Lôi' | 'Quang' | 'Ám' | 'Thổ'
export type Rarity = 'R' | 'SR' | 'SSR'
export type SkillType = 'basic' | 'active' | 'ultimate'
export type StatusEffect = 'stun' | 'slow' | 'attackUp' | 'shield' | 'immune'

export type Status = {
  type: StatusEffect
  turns: number
  value?: number
}

export type Spirit = {
  id: number
  name: string
  element: Element
  rarity: Rarity
  icon: string
  role: string
  power: number
  hp: number
  skill: string
  speed: number
  attack: number
  defense: number
  critRate: number
  critDamage: number
  evasion: number
  skills: Array<{ type: SkillType; name: string; multiplier: number; effect?: StatusEffect }>
}

export type BattleUnit = Spirit & {
  currentHp: number
  gauge: number
  statuses: Status[]
  team: 'ally' | 'enemy'
}

export type BattleState = {
  allies: BattleUnit[]
  foes: BattleUnit[]
  log: string[]
  phase: 'player' | 'enemy' | 'victory' | 'defeat' | 'paused'
  turnNumber: number
  currentTurnId: number | null
  auto: boolean
  speedMultiplier: 1 | 2 | 3
  reward: { spiritXp: number; spiritStones: number } | null
}
