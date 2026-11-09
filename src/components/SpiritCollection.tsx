import { useMemo, useState } from 'react'
import type { Element, OwnedSpirit, Rarity } from '../domain/gameTypes'
import { addSpiritExperience, awakenSpirit, evolveSpirit } from '../domain/spiritProgression'

type SpiritCollectionProps = {
  spirits: OwnedSpirit[]
  onChange: (spirits: OwnedSpirit[]) => void
}

const elements: Array<'Tất cả' | Element> = ['Tất cả', 'Hỏa', 'Thủy', 'Mộc', 'Lôi', 'Thổ', 'Quang', 'Ám']
const rarities: Array<'Tất cả' | Rarity> = ['Tất cả', 'SSR', 'SR', 'R']

export function SpiritCollection({ spirits, onChange }: SpiritCollectionProps) {
  const [selectedId, setSelectedId] = useState(spirits[0]?.id ?? 0)
  const [element, setElement] = useState<'Tất cả' | Element>('Tất cả')
  const [rarity, setRarity] = useState<'Tất cả' | Rarity>('Tất cả')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const selected = spirits.find((spirit) => spirit.id === selectedId) ?? spirits[0]
  const filtered = useMemo(() => spirits.filter((spirit) => (element === 'Tất cả' || spirit.element === element) && (rarity === 'Tất cả' || spirit.rarity === rarity) && (!favoritesOnly || spirit.favorite)), [element, favoritesOnly, rarity, spirits])

  const updateSelected = (update: (spirit: OwnedSpirit) => OwnedSpirit) => {
    if (!selected) return
    onChange(spirits.map((spirit) => spirit.id === selected.id ? update(spirit) : spirit))
  }

  return (
    <section className="collection-screen fade-in">
      <div className="collection-toolbar">
        <div><p className="eyebrow">TÀNG KINH CÁC</p><h2>Linh thú bản mệnh</h2><p className="collection-count">{filtered.length}/{spirits.length} linh thú đã thu thập</p></div>
        <div className="collection-filters"><select value={element} onChange={(event) => setElement(event.target.value as 'Tất cả' | Element)} aria-label="Lọc theo hệ">{elements.map((item) => <option key={item}>{item}</option>)}</select><select value={rarity} onChange={(event) => setRarity(event.target.value as 'Tất cả' | Rarity)} aria-label="Lọc theo phẩm chất">{rarities.map((item) => <option key={item}>{item}</option>)}</select><button className={favoritesOnly ? 'filter-button active' : 'filter-button'} onClick={() => setFavoritesOnly((value) => !value)}>★ Yêu thích</button></div>
      </div>
      <div className="collection-layout">
        <div className="collection-grid">{filtered.length === 0 ? <div className="empty-state">Không tìm thấy linh thú phù hợp với bộ lọc hiện tại.</div> : filtered.map((spirit) => <button className={`collection-card ${selected?.id === spirit.id ? 'selected' : ''}`} key={spirit.id} onClick={() => setSelectedId(spirit.id)}><div className="collection-art"><span>{spirit.image}</span><label>{spirit.rarity}</label><i>{'★'.repeat(spirit.stars)}</i>{spirit.favorite && <b>★</b>}</div><div className="collection-card-body"><strong>{spirit.name}</strong><small>{spirit.element} • {spirit.role}</small><div className="level-line"><span>Cấp {spirit.level}</span><em>{spirit.experience}/{spirit.experienceToNext}</em></div><div className="mini-bar"><i style={{ width: `${(spirit.experience / spirit.experienceToNext) * 100}%` }} /></div></div></button>)}</div>
        {selected ? <aside className="spirit-detail"><div className="detail-portrait"><span>{selected.image}</span><div><label>{selected.rarity} • {selected.element}</label><h2>{selected.name}</h2><p>{selected.role} · {selected.awakened ? 'Đã thức tỉnh' : 'Chưa thức tỉnh'}</p></div></div><div className="detail-actions"><button onClick={() => updateSelected((spirit) => ({ ...spirit, favorite: !spirit.favorite }))}>★ {selected.favorite ? 'Bỏ yêu thích' : 'Yêu thích'}</button><button onClick={() => updateSelected((spirit) => ({ ...spirit, locked: !spirit.locked }))}>🔒 {selected.locked ? 'Đã khóa' : 'Khóa'}</button></div><div className="stars">{'★'.repeat(selected.stars)}<span>{'★'.repeat(6 - selected.stars)}</span></div><div className="level-detail"><div><b>Cấp {selected.level}</b><span>{selected.experience}/{selected.experienceToNext} EXP</span></div><div className="detail-progress"><i style={{ width: `${Math.min(100, (selected.experience / selected.experienceToNext) * 100)}%` }} /></div></div><div className="stat-grid"><span><small>HP</small><b>{selected.hp.toLocaleString()}</b></span><span><small>CÔNG KÍCH</small><b>{selected.attack}</b></span><span><small>PHÒNG THỦ</small><b>{selected.defense}</b></span><span><small>TỐC ĐỘ</small><b>{selected.speed}</b></span><span><small>CHÍ MẠNG</small><b>{Math.round(selected.critRate * 100)}%</b></span><span><small>CHIẾN LỰC</small><b>{selected.power}</b></span></div><div className="detail-skills"><p className="eyebrow">BỘ KỸ NĂNG</p>{selected.skills.map((skill) => <div className="skill-row" key={skill.type}><b>{skill.type === 'basic' ? 'THƯỜNG' : skill.type === 'active' ? 'CHỦ ĐỘNG' : 'TỐI THƯỢNG'}</b><div><strong>{skill.name}</strong><small>Hệ số {skill.multiplier.toFixed(2)}x{skill.effect ? ` · Gây ${skill.effect}` : ''}</small></div></div>)}</div><div className="progression-actions"><button className="primary" onClick={() => updateSelected((spirit) => addSpiritExperience(spirit, 250))} disabled={selected.locked}>+250 EXP</button><button onClick={() => updateSelected(awakenSpirit)} disabled={selected.awakened || selected.locked}>Thức tỉnh</button><button onClick={() => updateSelected(evolveSpirit)} disabled={selected.stars >= 6 || selected.level < selected.stars * 10 || selected.locked}>Tiến hóa sao</button></div></aside> : <div className="empty-state">Chọn một linh thú để xem chi tiết.</div>}
      </div>
    </section>
  )
}
