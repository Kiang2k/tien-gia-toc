import type { OwnedSpirit } from './gameTypes'

export const levelUpSpirit = (spirit: OwnedSpirit): OwnedSpirit => {
  if (spirit.level >= 60 || spirit.experience < spirit.experienceToNext) return spirit
  return {
    ...spirit,
    level: spirit.level + 1,
    experience: spirit.experience - spirit.experienceToNext,
    experienceToNext: Math.round(spirit.experienceToNext * 1.14),
    hp: Math.round(spirit.hp * 1.06),
    attack: Math.round(spirit.attack * 1.06),
    defense: Math.round(spirit.defense * 1.06),
    power: Math.round(spirit.power * 1.06),
  }
}

export const addSpiritExperience = (spirit: OwnedSpirit, amount: number): OwnedSpirit => {
  let updated = { ...spirit, experience: spirit.experience + amount }
  while (updated.level < 60 && updated.experience >= updated.experienceToNext) updated = levelUpSpirit(updated)
  return updated
}

export const evolveSpirit = (spirit: OwnedSpirit): OwnedSpirit =>
  spirit.stars >= 6 || spirit.level < spirit.stars * 10 ? spirit : {
    ...spirit,
    stars: (spirit.stars + 1) as OwnedSpirit['stars'],
    level: 1,
    experience: 0,
    experienceToNext: Math.round(spirit.experienceToNext * 1.2),
    hp: Math.round(spirit.hp * 1.12),
    attack: Math.round(spirit.attack * 1.12),
    defense: Math.round(spirit.defense * 1.12),
    power: Math.round(spirit.power * 1.12),
  }

export const awakenSpirit = (spirit: OwnedSpirit): OwnedSpirit =>
  spirit.awakened ? spirit : { ...spirit, awakened: true, power: Math.round(spirit.power * 1.15), attack: Math.round(spirit.attack * 1.1) }
