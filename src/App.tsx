import { useMemo, useState } from 'react'
import './App.css'

type Spirit = {
  id: number
  name: string
  element: string
  rarity: string
  icon: string
  role: string
  power: number
  hp: number
  skill: string
}

type BattleUnit = Spirit & { currentHp: number }

const spirits: Spirit[] = [
  { id: 1, name: 'Hỏa Hồ Ly', element: 'Hỏa', rarity: 'SSR', icon: '🦊', role: 'Công kích', power: 936, hp: 1820, skill: 'Liệt Diễm Trảo' },
  { id: 2, name: 'Thanh Vân Hạc', element: 'Mộc', rarity: 'SR', icon: '🦅', role: 'Hỗ trợ', power: 712, hp: 2240, skill: 'Thanh Vân Hộ Thể' },
  { id: 3, name: 'Huyền Vũ', element: 'Thủy', rarity: 'SSR', icon: '🐢', role: 'Phòng thủ', power: 801, hp: 3180, skill: 'Huyền Giáp' },
  { id: 4, name: 'Lôi Linh', element: 'Lôi', rarity: 'R', icon: '⚡', role: 'Khống chế', power: 654, hp: 1650, skill: 'Thiên Lôi Dẫn' },
  { id: 5, name: 'Bạch Liên', element: 'Quang', rarity: 'SR', icon: '🪷', role: 'Hồi phục', power: 590, hp: 1950, skill: 'Liên Hoa Tịnh Tâm' },
]

const enemies: Spirit[] = [
  { id: 101, name: 'Ma Lang', element: 'Ám', rarity: 'R', icon: '🐺', role: 'Công kích', power: 560, hp: 2100, skill: 'U Minh Nha' },
  { id: 102, name: 'Cốt Tướng', element: 'Thổ', rarity: 'SR', icon: '💀', role: 'Phòng thủ', power: 620, hp: 2700, skill: 'Bạch Cốt Thuẫn' },
  { id: 103, name: 'Quỷ Đằng', element: 'Mộc', rarity: 'R', icon: '🌿', role: 'Khống chế', power: 480, hp: 1800, skill: 'Đằng Mộc Phược' },
  { id: 104, name: 'Huyết Nha', element: 'Hỏa', rarity: 'SR', icon: '🦇', role: 'Công kích', power: 710, hp: 1950, skill: 'Huyết Vũ' },
]

function App() {
  const [activeTab, setActiveTab] = useState('Đại Điện')
  const [team] = useState(spirits.slice(0, 4))
  const [summonCount, setSummonCount] = useState(0)
  const [energy, setEnergy] = useState(38)
  const [battle, setBattle] = useState<{ allies: BattleUnit[]; foes: BattleUnit[]; log: string[] } | null>(null)

  const collectionPower = useMemo(() => team.reduce((total, spirit) => total + spirit.power, 0), [team])

  const summon = () => {
    if (energy < 10) return
    setEnergy((value) => value - 10)
    setSummonCount((value) => value + 1)
  }

  const startBattle = () => {
    setBattle({
      allies: team.map((spirit) => ({ ...spirit, currentHp: spirit.hp })),
      foes: enemies.map((spirit) => ({ ...spirit, currentHp: spirit.hp })),
      log: ['Trận chiến bắt đầu. Hãy chọn một linh thú để tấn công!'],
    })
    setActiveTab('Chiến Đấu')
  }

  const attack = (attacker: BattleUnit) => {
    if (!battle || battle.foes.every((foe) => foe.currentHp <= 0)) return
    const target = battle.foes.find((foe) => foe.currentHp > 0)
    if (!target) return
    const damage = Math.max(90, Math.round(attacker.power / 3))
    const updatedFoes = battle.foes.map((foe) =>
      foe.id === target.id ? { ...foe, currentHp: Math.max(0, foe.currentHp - damage) } : foe,
    )
    const defeated = updatedFoes.every((foe) => foe.currentHp <= 0)
    setBattle({
      ...battle,
      foes: updatedFoes,
      log: [`${attacker.name} dùng ${attacker.skill}, gây ${damage} sát thương lên ${target.name}.`, ...battle.log].slice(0, 4),
    })
    if (!defeated) {
      window.setTimeout(() => enemyTurn(updatedFoes), 350)
    }
  }

  const enemyTurn = (currentFoes: BattleUnit[]) => {
    setBattle((current) => {
      if (!current) return current
      const enemy = currentFoes.find((foe) => foe.currentHp > 0)
      const ally = current.allies.find((unit) => unit.currentHp > 0)
      if (!enemy || !ally) return current
      const damage = Math.max(55, Math.round(enemy.power / 4))
      return {
        ...current,
        allies: current.allies.map((unit) => unit.id === ally.id ? { ...unit, currentHp: Math.max(0, unit.currentHp - damage) } : unit),
        log: [`${enemy.name} phản công ${ally.name}, gây ${damage} sát thương.`, ...current.log].slice(0, 4),
      }
    })
  }

  return (
    <main className="game-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">☯</span><div><strong>VẠN CỔ</strong><small>GIA TỘC TU TIÊN</small></div></div>
        <div className="resources"><span>💠 <b>12,480</b></span><span>🪙 <b>86,320</b></span><span>⚡ <b>{energy}/60</b></span><div className="avatar">K</div></div>
      </header>

      <section className="hero-panel">
        <div className="hero-copy"><p className="eyebrow">ĐỆ TỬ ĐỜI THỨ 18</p><h1>Gia tộc <em>Vạn Cổ</em></h1><p>Tu hành nghìn năm, một bước thành tiên.</p><button className="primary" onClick={startBattle}>⚔  Vào bí cảnh</button></div>
        <div className="mountain"><div className="moon">☾</div><div className="pagoda">♜</div><div className="mist mist-one" /><div className="mist mist-two" /></div>
        <div className="clan-stats"><span><small>CẤP GIA TỘC</small><b>18</b></span><span><small>LINH THẠCH</small><b>2,840</b></span><span><small>CHIẾN LỰC</small><b>{collectionPower.toLocaleString()}</b></span></div>
      </section>

      <nav className="tabs">{['Đại Điện', 'Linh Thú', 'Chiến Đấu', 'Gia Tộc'].map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav>

      {activeTab === 'Chiến Đấu' && battle ? (
        <section className="battle-board">
          <div className="battle-heading"><div><p className="eyebrow">BÍ CẢNH • TẦNG 03</p><h2>Thí luyện Ma Uyên</h2></div><span className="turn-chip">LƯỢT CỦA BẠN</span></div>
          <div className="arena">
            <div className="side"><h3>ĐỘI HÌNH GIA TỘC</h3>{battle.allies.map((unit) => <button className="unit-card ally" disabled={unit.currentHp <= 0} key={unit.id} onClick={() => attack(unit)}><span className="unit-icon">{unit.icon}</span><div><b>{unit.name}</b><small>{unit.skill}</small><div className="bar"><i style={{ width: `${(unit.currentHp / unit.hp) * 100}%` }} /></div></div></button>)}</div>
            <div className="versus">VS<div className="battle-log">{battle.log.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div></div>
            <div className="side enemy-side"><h3>MA UYÊN</h3>{battle.foes.map((unit) => <div className={`unit-card enemy ${unit.currentHp <= 0 ? 'defeated' : ''}`} key={unit.id}><span className="unit-icon">{unit.icon}</span><div><b>{unit.name}</b><small>{unit.role}</small><div className="bar"><i style={{ width: `${(unit.currentHp / unit.hp) * 100}%` }} /></div></div></div>)}</div>
          </div>
          {battle.foes.every((foe) => foe.currentHp <= 0) && <div className="victory">✨ Bí cảnh đã chinh phục! +500 linh thạch</div>}
        </section>
      ) : (
        <section className="content-grid">
          <div className="main-column">
            <div className="section-heading"><div><p className="eyebrow">LINH THÚ BẢN MỆNH</p><h2>Đội hình xuất chiến</h2></div><button className="text-button" onClick={() => setActiveTab('Linh Thú')}>Xem tất cả →</button></div>
            <div className="spirit-grid">{team.map((spirit) => <article className="spirit-card" key={spirit.id}><div className="spirit-art"><span>{spirit.icon}</span><label>{spirit.rarity}</label></div><div className="spirit-info"><div><h3>{spirit.name}</h3><span className={`element ${spirit.element}`}>{spirit.element} • {spirit.role}</span></div><strong>{spirit.power}</strong></div><div className="mini-bar"><i style={{ width: `${Math.min(100, spirit.power / 10)}%` }} /></div></article>)}</div>
            <div className="summon-card"><div><p className="eyebrow">TỤ LINH ĐÀI</p><h2>Triệu hồi linh thú</h2><p>Dùng 10 linh lực để triệu hồi một đồng hành mới.</p></div><button className="primary" onClick={summon}>召 Triệu hồi <small>10 ⚡</small></button>{summonCount > 0 && <span className="summon-toast">Đã triệu hồi {summonCount} lần! Linh khí dâng trào.</span>}</div>
          </div>
          <aside className="side-panel"><div className="section-heading"><div><p className="eyebrow">NHẬT KÝ TU HÀNH</p><h2>Nhiệm vụ hôm nay</h2></div></div><div className="quest"><span className="quest-icon">🔥</span><div><b>Chinh phục Ma Uyên</b><p>Hoàn thành 1 trận chiến</p><div className="quest-progress"><i /></div></div><em>1/3</em></div><div className="quest"><span className="quest-icon">🪷</span><div><b>Thu thập linh thạch</b><p>Nhận 1,000 linh thạch</p><div className="quest-progress half"><i /></div></div><em>680/1000</em></div><div className="sect-divider" /><div className="section-heading"><div><p className="eyebrow">TIN TỨC GIA TỘC</p><h2>Thông báo</h2></div></div><p className="notice">⚔ Đại hội tông môn sẽ mở vào ngày mai. Chuẩn bị đội hình của bạn.</p><p className="notice">🎁 Quà đăng nhập ngày 7 đã sẵn sàng nhận.</p></aside>
        </section>
      )}
      <footer><span>VẠN CỔ • BẢN THỬ NGHIỆM 0.1</span><span>Chúc đạo hữu tu hành tinh tấn ✦</span></footer>
    </main>
  )
}

export default App
