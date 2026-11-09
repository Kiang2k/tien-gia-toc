import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { BattleView } from './components/BattleView'
import { SpiritCard } from './components/SpiritCard'
import { SpiritCollection } from './components/SpiritCollection'
import { dungeonEnemies, navigationTabs, type NavigationTab } from './data/gameData'
import { collectionSpirits } from './data/spiritCollection'
import { createBattle, performAttack, performEnemyTurn, toggleBattlePaused } from './domain/battleEngine'
import type { BattleState, BattleUnit, OwnedSpirit } from './domain/gameTypes'
import { SummonModal } from './components/SummonModal'
import { playUiTone } from './domain/sound'

function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('Đại Điện')
  const [ready, setReady] = useState(false)
  const [collection, setCollection] = useState<OwnedSpirit[]>(collectionSpirits)
  const [summonCount, setSummonCount] = useState(0)
  const [energy, setEnergy] = useState(38)
  const [battle, setBattle] = useState<BattleState | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [summonOpen, setSummonOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const team = useMemo(() => collection.slice(0, 4), [collection])

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 350)
    return () => window.clearTimeout(timer)
  }, [])

  const collectionPower = useMemo(() => team.reduce((total, spirit) => total + spirit.power, 0), [team])

  const summon = () => {
    if (energy < 10) {
      setNotice('Linh lực chưa đủ. Hãy chờ hồi phục trước khi triệu hồi.')
      return
    }
    setEnergy((value) => value - 10)
    setSummonCount((value) => value + 1)
    setNotice('Linh thú đã cảm ứng được lời triệu gọi của bạn.')
    playUiTone(soundEnabled, 660)
  }

  const startBattle = () => {
    setBattle(createBattle(team, dungeonEnemies))
    setActiveTab('Chiến Đấu')
  }

  const resolveAttack = useCallback((attacker: BattleUnit, skillType: 'basic' | 'active' | 'ultimate') => {
    if (!battle) return
    if (battle.phase === 'paused') return
    const next = performAttack(battle, attacker.id, skillType)
    setBattle(next)
    if (next.phase === 'enemy') {
      window.setTimeout(() => setBattle((current) => current ? performEnemyTurn(current) : current), 700 / next.speedMultiplier)
    }
  }, [battle])

  const toggleAuto = () => setBattle((current) => current ? { ...current, auto: !current.auto } : current)
  const changeSpeed = () => setBattle((current) => current ? { ...current, speedMultiplier: current.speedMultiplier === 3 ? 1 : (current.speedMultiplier + 1) as 1 | 2 | 3 } : current)
  const togglePause = () => setBattle((current) => current ? toggleBattlePaused(current) : current)

  useEffect(() => {
    if (!battle?.auto || battle.phase !== 'player') return
    const attacker = battle.allies.find((unit) => unit.currentHp > 0)
    if (!attacker) return
    const timer = window.setTimeout(() => resolveAttack(attacker, 'active'), 500 / battle.speedMultiplier)
    return () => window.clearTimeout(timer)
  }, [battle, resolveAttack])

  if (!ready) {
    return <main className="loading-screen"><div className="loading-seal">☯</div><p>Đang khai mở sơn môn...</p><div className="loading-track"><i /></div></main>
  }

  return (
    <main className="game-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">☯</span><div><strong>VẠN CỔ</strong><small>GIA TỘC TU TIÊN</small></div></div>
        <div className="resources"><span>💠 <b>12,480</b></span><span>🪙 <b>86,320</b></span><span>⚡ <b>{energy}/60</b></span><button className="sound-toggle" onClick={() => setSoundEnabled((value) => !value)} aria-label="Bật tắt âm thanh">{soundEnabled ? '🔊' : '🔇'}</button><div className="avatar">K</div></div>
      </header>
      <section className="hero-panel">
        <div className="hero-copy"><p className="eyebrow">ĐỆ TỬ ĐỜI THỨ 18</p><h1>Gia tộc <em>Vạn Cổ</em></h1><p>Tu hành nghìn năm, một bước thành tiên.</p><button className="primary" onClick={startBattle}>⚔ Vào bí cảnh</button></div>
        <div className="mountain"><div className="moon">☾</div><div className="pagoda">♜</div><div className="mist mist-one" /><div className="mist mist-two" /></div>
        <div className="clan-stats"><span><small>CẤP GIA TỘC</small><b>18</b></span><span><small>LINH THẠCH</small><b>2,840</b></span><span><small>CHIẾN LỰC</small><b>{collectionPower.toLocaleString()}</b></span></div>
      </section>
      <nav className="tabs" aria-label="Điều hướng game">{navigationTabs.map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav>
      {activeTab === 'Chiến Đấu' && battle ? <BattleView battle={battle} onAttack={(unit) => resolveAttack(unit, 'active')} onSkill={resolveAttack} onPause={togglePause} onToggleAuto={toggleAuto} onSpeedChange={changeSpeed} /> : activeTab === 'Linh Thú' ? <SpiritCollection spirits={collection} onChange={setCollection} /> : (
        <section className="content-grid fade-in">
          <div className="main-column">
            <div className="section-heading"><div><p className="eyebrow">LINH THÚ BẢN MỆNH</p><h2>Đội hình xuất chiến</h2></div><button className="text-button" onClick={() => setActiveTab('Linh Thú')}>Xem tất cả →</button></div>
            {team.length === 0 ? <div className="empty-state">Chưa có linh thú. Hãy đến Tụ Linh Đài để bắt đầu hành trình.</div> : <div className="spirit-grid">{team.map((spirit) => <SpiritCard key={spirit.id} spirit={spirit} />)}</div>}
            <div className="summon-card"><div><p className="eyebrow">TỤ LINH ĐÀI</p><h2>Triệu hồi linh thú</h2><p>Dùng 10 linh lực để triệu hồi một đồng hành mới. Tỷ lệ SSR: 5%.</p></div><button className="primary" onClick={() => setSummonOpen(true)} disabled={energy < 10}>召 Triệu hồi <small>10 ⚡</small></button>{summonCount > 0 && <span className="summon-toast">Đã triệu hồi {summonCount} lần! {notice}</span>}</div>
            {notice && <p className="status-message" role="status">{notice}</p>}
          </div>
          <aside className="side-panel"><div className="section-heading"><div><p className="eyebrow">NHẬT KÝ TU HÀNH</p><h2>Nhiệm vụ hôm nay</h2></div></div><div className="quest"><span className="quest-icon">🔥</span><div><b>Chinh phục Ma Uyên</b><p>Hoàn thành 1 trận chiến</p><div className="quest-progress"><i /></div></div><em>1/3</em></div><div className="quest"><span className="quest-icon">🪷</span><div><b>Thu thập linh thạch</b><p>Nhận 1,000 linh thạch</p><div className="quest-progress half"><i /></div></div><em>680/1000</em></div><div className="sect-divider" /><div className="section-heading"><div><p className="eyebrow">TIN TỨC GIA TỘC</p><h2>Thông báo</h2></div></div><p className="notice">⚔ Đại hội tông môn sẽ mở vào ngày mai. Chuẩn bị đội hình của bạn.</p><p className="notice">🎁 Quà đăng nhập ngày 7 đã sẵn sàng nhận.</p></aside>
        </section>
      )}
      {summonOpen && <SummonModal onClose={() => setSummonOpen(false)} onSummon={summon} />}
      <footer><span>VẠN CỔ • BẢN THỬ NGHIỆM 0.2</span><span>Chúc đạo hữu tu hành tinh tấn ✦</span></footer>
    </main>
  )
}

export default App
