import type { BattleState, BattleUnit, Element, SkillType, Spirit, StatusEffect } from './gameTypes'

export type RandomSource = () => number

const alive = (unit: BattleUnit) => unit.currentHp > 0
const status = (unit: BattleUnit, type: StatusEffect) => unit.statuses.find((item) => item.type === type && item.turns > 0)

const effectiveness: Record<Element, Partial<Record<Element, number>>> = {
  Hỏa: { Mộc: 1.25, Thủy: 0.75 },
  Thủy: { Hỏa: 1.25, Lôi: 0.75 },
  Mộc: { Thổ: 1.25, Hỏa: 0.75 },
  Lôi: { Thủy: 1.25, Thổ: 0.75 },
  Thổ: { Lôi: 1.25, Mộc: 0.75 },
  Quang: { Ám: 1.25 },
  Ám: { Quang: 1.25 },
}

export const getElementMultiplier = (attacker: Element, defender: Element): number =>
  effectiveness[attacker][defender] ?? 1

export const calculateDamage = (
  attacker: Pick<BattleUnit, 'attack' | 'element' | 'critRate' | 'critDamage'>,
  defender: Pick<BattleUnit, 'defense' | 'element' | 'evasion' | 'statuses'>,
  skillMultiplier: number,
  random: RandomSource = Math.random,
) => {
  if (defender.statuses.some((item) => item.type === 'immune' && item.turns > 0)) {
    return { damage: 0, dodged: false, critical: false, multiplier: 0, immune: true }
  }
  if (random() < defender.evasion) return { damage: 0, dodged: true, critical: false, multiplier: 0, immune: false }
  const critical = random() < attacker.critRate
  const multiplier = getElementMultiplier(attacker.element, defender.element)
  const raw = attacker.attack * skillMultiplier * multiplier * (critical ? attacker.critDamage : 1)
  const damage = Math.max(1, Math.round(raw * (100 / (100 + defender.defense))))
  return { damage, dodged: false, critical, multiplier, immune: false }
}

const createUnit = (spirit: Spirit, team: BattleUnit['team']): BattleUnit => ({
  ...spirit,
  currentHp: spirit.hp,
  gauge: 0,
  statuses: [],
  team,
})

export const createBattle = (allies: Spirit[], foes: Spirit[]): BattleState => ({
  allies: allies.map((spirit) => createUnit(spirit, 'ally')),
  foes: foes.map((spirit) => createUnit(spirit, 'enemy')),
  log: ['Trận chiến bắt đầu. Tốc độ quyết định thứ tự lượt.'],
  phase: 'player',
  turnNumber: 1,
  currentTurnId: null,
  auto: false,
  speedMultiplier: 1,
  reward: null,
})

export const getTurnOrder = (state: BattleState) => [...state.allies, ...state.foes]
  .filter(alive)
  .sort((a, b) => b.speed - a.speed)
  .map((unit) => unit.id)

const addStatus = (unit: BattleUnit, effect: StatusEffect): BattleUnit => {
  if (effect === 'shield') return { ...unit, statuses: [...unit.statuses.filter((item) => item.type !== effect), { type: effect, turns: 2, value: 0.25 }] }
  return { ...unit, statuses: [...unit.statuses.filter((item) => item.type !== effect), { type: effect, turns: 2 }] }
}

const nextPhase = (allies: BattleUnit[], foes: BattleUnit[]): BattleState['phase'] => {
  if (foes.every((unit) => !alive(unit))) return 'victory'
  if (allies.every((unit) => !alive(unit))) return 'defeat'
  return 'player'
}

export const performAttack = (
  state: BattleState,
  attackerId: number,
  skillType: SkillType = 'active',
  random: RandomSource = Math.random,
): BattleState => {
  if (state.phase !== 'player') return state
  const attacker = state.allies.find((unit) => unit.id === attackerId && alive(unit))
  const target = state.foes.find(alive)
  if (!attacker || !target) return state
  if (status(attacker, 'stun')) return { ...state, log: [`${attacker.name} bị choáng và bỏ lượt.`, ...state.log].slice(0, 6), phase: 'enemy' }

  const skill = attacker.skills.find((item) => item.type === skillType) ?? attacker.skills[0]
  const result = calculateDamage(attacker, target, skill.multiplier, random)
  const updatedTarget = result.dodged
    ? target
    : skill.effect
      ? addStatus({ ...target, currentHp: Math.max(0, target.currentHp - result.damage) }, skill.effect)
      : { ...target, currentHp: Math.max(0, target.currentHp - result.damage) }
  const foes = state.foes.map((unit) => unit.id === target.id ? updatedTarget : unit)
  const effectText = skill.effect ? ` ${skill.effect} hiệu lực.` : ''
  const resultText = result.immune ? `${target.name} miễn nhiễm sát thương!` : result.dodged ? `${target.name} né đòn!` : `${result.critical ? 'BẠO KÍCH! ' : ''}gây ${result.damage} sát thương${effectText}`
  const phase = nextPhase(state.allies, foes)
  return {
    ...state,
    foes,
    phase: phase === 'victory' ? 'victory' : 'enemy',
    log: [`${attacker.name} dùng ${skill.name}, ${resultText}`, ...state.log].slice(0, 6),
    reward: phase === 'victory' ? { spiritXp: 800, spiritStones: 500 } : null,
  }
}

export const performEnemyTurn = (state: BattleState, random: RandomSource = Math.random): BattleState => {
  if (state.phase !== 'enemy') return state
  const enemy = [...state.foes].filter(alive).sort((a, b) => b.speed - a.speed)[0]
  const target = state.allies.find(alive)
  if (!enemy || !target) return { ...state, phase: 'defeat' }
  const skill = enemy.skills.find((item) => item.type === 'basic') ?? enemy.skills[0]
  const result = calculateDamage(enemy, target, skill.multiplier, random)
  const updatedTarget = result.dodged || result.immune ? target : { ...target, currentHp: Math.max(0, target.currentHp - result.damage) }
  const allies = state.allies.map((unit) => unit.id === target.id ? updatedTarget : unit).map((unit) => ({
    ...unit,
    statuses: unit.statuses.map((item) => ({ ...item, turns: item.turns - 1 })).filter((item) => item.turns > 0),
  }))
  const phase = nextPhase(allies, state.foes)
  return {
    ...state,
    allies,
    phase,
    turnNumber: state.turnNumber + 1,
    log: [`${enemy.name} dùng ${skill.name}, ${result.dodged ? 'nhưng bị né!' : `gây ${result.damage} sát thương.`}`, ...state.log].slice(0, 6),
  }
}

export const toggleBattlePaused = (state: BattleState): BattleState => ({
  ...state,
  phase: state.phase === 'paused' ? 'player' : state.phase === 'player' || state.phase === 'enemy' ? 'paused' : state.phase,
})
