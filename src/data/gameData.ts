import type { Spirit } from '../domain/gameTypes'

export const initialSpirits: Spirit[] = [
  { id: 1, name: 'Hỏa Hồ Ly', element: 'Hỏa', rarity: 'SSR', icon: '🦊', role: 'Công kích', power: 936, hp: 1820, skill: 'Liệt Diễm Trảo' },
  { id: 2, name: 'Thanh Vân Hạc', element: 'Mộc', rarity: 'SR', icon: '🦅', role: 'Hỗ trợ', power: 712, hp: 2240, skill: 'Thanh Vân Hộ Thể' },
  { id: 3, name: 'Huyền Vũ', element: 'Thủy', rarity: 'SSR', icon: '🐢', role: 'Phòng thủ', power: 801, hp: 3180, skill: 'Huyền Giáp' },
  { id: 4, name: 'Lôi Linh', element: 'Lôi', rarity: 'R', icon: '⚡', role: 'Khống chế', power: 654, hp: 1650, skill: 'Thiên Lôi Dẫn' },
  { id: 5, name: 'Bạch Liên', element: 'Quang', rarity: 'SR', icon: '🪷', role: 'Hồi phục', power: 590, hp: 1950, skill: 'Liên Hoa Tịnh Tâm' },
]

export const dungeonEnemies: Spirit[] = [
  { id: 101, name: 'Ma Lang', element: 'Ám', rarity: 'R', icon: '🐺', role: 'Công kích', power: 560, hp: 2100, skill: 'U Minh Nha' },
  { id: 102, name: 'Cốt Tướng', element: 'Thổ', rarity: 'SR', icon: '💀', role: 'Phòng thủ', power: 620, hp: 2700, skill: 'Bạch Cốt Thuẫn' },
  { id: 103, name: 'Quỷ Đằng', element: 'Mộc', rarity: 'R', icon: '🌿', role: 'Khống chế', power: 480, hp: 1800, skill: 'Đằng Mộc Phược' },
  { id: 104, name: 'Huyết Nha', element: 'Hỏa', rarity: 'SR', icon: '🦇', role: 'Công kích', power: 710, hp: 1950, skill: 'Huyết Vũ' },
]

export const navigationTabs = ['Đại Điện', 'Linh Thú', 'Chiến Đấu', 'Gia Tộc'] as const
export type NavigationTab = typeof navigationTabs[number]
