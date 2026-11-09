import type { BattleState, BattleUnit, Spirit } from './gameTypes'

const alive = (unit: BattleUnit) => unit.currentHp > 0

export const createBattle = (allies: Spirit[], foes: Spirit[]): BattleState => ({
  allies: allies.map((spirit) => ({ ...spirit, currentHp: spirit.hp })),
  foes: foes.map((spirit) => ({ ...spirit, currentHp: spirit.hp })),
  log: ['Trận chiến bắt đầu. Hãy chọn một linh thú để tấn công!'],
  phase: 'player',
})

export const performAttack = (state: BattleState, attackerId: number): BattleState => {
  if (state.phase !== 'player') return state
  const attacker = state.allies.find((unit) => unit.id === attackerId && alive(unit))
  const target = state.foes.find(alive)
  if (!attacker || !target) return state

  const damage = Math.max(90, Math.round(attacker.power / 3))
  const foes = state.foes.map((foe) =>
    foe.id === target.id ? { ...foe, currentHp: Math.max(0, foe.currentHp - damage) } : foe,
  )
  const victory = foes.every((foe) => !alive(foe))
  return {
    ...state,
    foes,
    phase: victory ? 'victory' : 'enemy',
    log: [`${attacker.name} dùng ${attacker.skill}, gây ${damage} sát thương lên ${target.name}.`, ...state.log].slice(0, 4),
  }
}

export const performEnemyTurn = (state: BattleState): BattleState => {
  if (state.phase !== 'enemy') return state
  const enemy = state.foes.find(alive)
  const target = state.allies.find(alive)
  if (!enemy || !target) return { ...state, phase: 'defeat' }

  const damage = Math.max(55, Math.round(enemy.power / 4))
  const allies = state.allies.map((unit) =>
    unit.id === target.id ? { ...unit, currentHp: Math.max(0, unit.currentHp - damage) } : unit,
  )
  const defeat = allies.every((unit) => !alive(unit))
  return {
    ...state,
    allies,
    phase: defeat ? 'defeat' : 'player',
    log: [`${enemy.name} phản công ${target.name}, gây ${damage} sát thương.`, ...state.log].slice(0, 4),
  }
}
