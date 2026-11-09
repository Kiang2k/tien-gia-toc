import type { CSSProperties } from 'react'
import type { BattleState, BattleUnit } from '../domain/gameTypes'
import { assetManifest } from '../data/assetManifest'
import { AssetImage } from './AssetImage'

type BattleViewProps = {
  battle: BattleState
  onAttack: (unit: BattleUnit) => void
  onSkill: (unit: BattleUnit, skillType: 'basic' | 'active' | 'ultimate') => void
  onPause: () => void
  onToggleAuto: () => void
  onSpeedChange: () => void
}

function UnitCard({ unit, ally, onAttack }: { unit: BattleUnit; ally: boolean; onAttack?: () => void }) {
  const health = `${(unit.currentHp / unit.hp) * 100}%`
  const card = (
    <>
      <AssetImage src={unit.image} fallback={assetManifest.fallbackSpirit} alt={unit.name} className="unit-image" />
      <div><b>{unit.name}</b><small>{ally ? unit.skill : unit.role}</small><div className="bar"><i style={{ width: health }} /></div><div className="speed-meter"><i style={{ width: `${Math.min(100, unit.speed / 1.4)}%` }} /></div></div>
    </>
  )
  return ally ? <button className="unit-card ally" disabled={unit.currentHp <= 0} onClick={onAttack}>{card}</button> : <div className={`unit-card enemy ${unit.currentHp <= 0 ? 'defeated' : ''}`}>{card}</div>
}

function StageUnit({ unit, active, index }: { unit: BattleUnit; active: boolean; index: number }) {
  return <div className={`stage-unit ${unit.currentHp <= 0 ? 'stage-defeated' : ''} ${active ? 'stage-active' : ''}`} style={{ '--unit-index': index } as CSSProperties}>
    <div className="stage-aura" />
    <AssetImage src={unit.image} fallback={assetManifest.fallbackSpirit} alt={unit.name} className="stage-image" />
    <div className="stage-name">{unit.name}</div>
    <div className="stage-hp"><i style={{ width: `${(unit.currentHp / unit.hp) * 100}%` }} /></div>
    <div className="stage-status">{unit.statuses.map((item) => <span key={item.type}>{item.type === 'stun' ? 'Choáng' : item.type === 'shield' ? 'Hộ thể' : item.type === 'slow' ? 'Chậm' : 'Buff'}</span>)}</div>
  </div>
}

export function BattleView({ battle, onAttack, onSkill, onPause, onToggleAuto, onSpeedChange }: BattleViewProps) {
  const finished = battle.phase === 'victory' || battle.phase === 'defeat'
  const latestLog = battle.log[0] ?? ''
  const effectType = latestLog.includes('BẠO KÍCH') ? 'critical' : latestLog.includes('né') ? 'dodge' : latestLog.includes('gây') ? 'hit' : 'idle'
  const activeAlly = battle.allies.find((unit) => unit.currentHp > 0)
  const activeEnemy = battle.foes.find((unit) => unit.currentHp > 0)

  return (
    <section className="battle-board fade-in">
      <div className="battle-heading"><div><p className="eyebrow">BÍ CẢNH • TẦNG 03 • LƯỢT {battle.turnNumber}</p><h2>Thí luyện Ma Uyên</h2></div><div className="battle-controls"><span className="turn-chip">{battle.phase === 'player' ? 'LƯỢT CỦA BẠN' : finished ? 'TRẬN ĐẤU KẾT THÚC' : battle.phase === 'paused' ? 'ĐÃ TẠM DỪNG' : 'ĐỐI THỦ ĐANG HÀNH ĐỘNG'}</span><button className="control-button" onClick={onToggleAuto} disabled={finished}>{battle.auto ? '⏹ Tự động' : '▶ Tự động'}</button><button className="control-button" onClick={onSpeedChange} disabled={finished}>⏩ {battle.speedMultiplier}x</button><button className="control-button" onClick={onPause} disabled={finished}>{battle.phase === 'paused' ? 'Tiếp tục' : '⏸ Dừng'}</button></div></div>
      <div className="turn-order"><span>THỨ TỰ TỐC ĐỘ</span>{[...battle.allies, ...battle.foes].filter((unit) => unit.currentHp > 0).sort((a, b) => b.speed - a.speed).map((unit) => <b className={unit.team} key={unit.id}>{unit.icon} {unit.speed}</b>)}</div>
      <div className={`battle-stage effect-${effectType}`} key={latestLog}>
        <div className="stage-stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div className="stage-title"><span>✦</span> MA UYÊN · TẦNG 03 <span>✦</span></div>
        <div className="stage-team ally-stage">{battle.allies.map((unit, index) => <StageUnit key={unit.id} unit={unit} active={activeAlly?.id === unit.id} index={index} />)}</div>
        <div className="stage-center"><div className="battle-sigil">☯</div><div className="stage-impact" /><div className="damage-pop">{latestLog.includes('gây') ? latestLog.match(/\d+/)?.[0] ?? '' : ''}</div><span className="stage-vs">VS</span></div>
        <div className="stage-team enemy-stage">{battle.foes.map((unit, index) => <StageUnit key={unit.id} unit={unit} active={activeEnemy?.id === unit.id} index={index} />)}</div>
        <div className="battle-log stage-log" aria-live="polite">{battle.log.slice(0, 3).map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div>
      </div>
      <div className="battle-roster">
        <div className="side"><h3>ĐỘI HÌNH GIA TỘC</h3>{battle.allies.map((unit) => <div key={unit.id}><UnitCard unit={unit} ally onAttack={() => onAttack(unit)} /><div className="skill-actions">{unit.skills.map((skill) => <button key={skill.type} className="skill-button" disabled={unit.currentHp <= 0 || battle.phase !== 'player'} onClick={() => onSkill(unit, skill.type)}>{skill.type === 'basic' ? 'Thường' : skill.type === 'active' ? 'Chủ động' : 'Tối thượng'}</button>)}</div></div>)}</div>
        <div className="side enemy-side"><h3>MA UYÊN</h3>{battle.foes.map((unit) => <UnitCard key={unit.id} unit={unit} ally={false} />)}</div>
      </div>
      {battle.phase === 'victory' && <div className="victory">✨ Bí cảnh đã chinh phục! +500 linh thạch</div>}
      {battle.phase === 'defeat' && <div className="defeat">☁ Đội hình đã kiệt sức. Hãy dưỡng thương rồi thử lại.</div>}
      {battle.reward && <div className="reward-banner">🎁 Nhận thưởng: +{battle.reward.spiritXp} EXP linh thú • +{battle.reward.spiritStones} linh thạch</div>}
    </section>
  )
}
