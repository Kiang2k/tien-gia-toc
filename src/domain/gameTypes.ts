export type Element = 'Hỏa' | 'Mộc' | 'Thủy' | 'Lôi' | 'Quang' | 'Ám' | 'Thổ'
export type Rarity = 'R' | 'SR' | 'SSR'

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
}

export type BattleUnit = Spirit & { currentHp: number }

export type BattleState = {
  allies: BattleUnit[]
  foes: BattleUnit[]
  log: string[]
  phase: 'player' | 'enemy' | 'victory' | 'defeat'
}
