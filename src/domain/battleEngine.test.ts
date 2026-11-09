import { describe, expect, it } from 'vitest'
import { calculateDamage, createBattle, getElementMultiplier, getTurnOrder, performAttack } from './battleEngine'
import { dungeonEnemies, initialSpirits } from '../data/gameData'

describe('battle element rules', () => {
  it('applies elemental advantage and disadvantage', () => {
    expect(getElementMultiplier('Hỏa', 'Mộc')).toBe(1.25)
    expect(getElementMultiplier('Hỏa', 'Thủy')).toBe(0.75)
    expect(getElementMultiplier('Quang', 'Ám')).toBe(1.25)
    expect(getElementMultiplier('Thổ', 'Thổ')).toBe(1)
  })

  it('calculates a critical hit with elemental advantage', () => {
    const result = calculateDamage(
      { attack: 400, element: 'Hỏa', critRate: 1, critDamage: 1.5 },
      { defense: 100, element: 'Mộc', evasion: 0, statuses: [] },
      1,
      () => 0,
    )
    expect(result.critical).toBe(true)
    expect(result.dodged).toBe(false)
    expect(result.damage).toBe(375)
  })

  it('returns zero damage when the defender evades', () => {
    const result = calculateDamage(
      { attack: 400, element: 'Hỏa', critRate: 0, critDamage: 1.5 },
      { defense: 100, element: 'Mộc', evasion: 1, statuses: [] },
      1,
      () => 0,
    )
    expect(result.damage).toBe(0)
    expect(result.dodged).toBe(true)
  })
})

describe('turn-based battle', () => {
  it('creates a four versus four battle and orders by speed', () => {
    const battle = createBattle(initialSpirits.slice(0, 4), dungeonEnemies)
    expect(battle.allies).toHaveLength(4)
    expect(battle.foes).toHaveLength(4)
    expect(battle.allies[0].team).toBe('ally')
    expect(battle.foes[0].team).toBe('enemy')
    expect(getTurnOrder(battle)[0]).toBe(4)
  })

  it('uses the selected active skill and deals skill-scaled damage', () => {
    const battle = createBattle(initialSpirits.slice(0, 4), dungeonEnemies)
    const next = performAttack(battle, 1, 'ultimate', () => 0.99)
    expect(next.log[0]).toContain('Cửu Vĩ Phần Thiên')
    expect(next.foes[0].currentHp).toBeLessThan(dungeonEnemies[0].hp)
  })
})
