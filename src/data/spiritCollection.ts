import { initialSpirits } from './gameData'
import type { OwnedSpirit } from '../domain/gameTypes'

export const collectionSpirits: OwnedSpirit[] = initialSpirits.map((spirit, index) => ({
  ...spirit,
  level: index === 0 ? 32 : index === 2 ? 28 : 24,
  experience: index === 0 ? 640 : 180,
  experienceToNext: 1000,
  stars: index < 2 ? 5 : 4,
  awakened: index === 0 || index === 2,
  locked: index < 3,
  favorite: index === 0 || index === 2,
}))
