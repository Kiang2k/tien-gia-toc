import type { BattleState, BattleUnit } from '../domain/gameTypes'

type BattleViewProps = {
  battle: BattleState
  onAttack: (unit: BattleUnit) => void
}

function UnitCard({ unit, ally, onAttack }: { unit: BattleUnit; ally: boolean; onAttack?: () => void }) {
  const health = `${(unit.currentHp / unit.hp) * 100}%`
  const card = (
    <>
      <span className="unit-icon" aria-hidden="true">{unit.icon}</span>
      <div><b>{unit.name}</b><small>{ally ? unit.skill : unit.role}</small><div className="bar"><i style={{ width: health }} /></div></div>
    </>
  )
  return ally ? <button className="unit-card ally" disabled={unit.currentHp <= 0} onClick={onAttack}>{card}</button> : <div className={`unit-card enemy ${unit.currentHp <= 0 ? 'defeated' : ''}`}>{card}</div>
}

export function BattleView({ battle, onAttack }: BattleViewProps) {
  const finished = battle.phase === 'victory' || battle.phase === 'defeat'
  return (
    <section className="battle-board fade-in">
      <div className="battle-heading"><div><p className="eyebrow">BÍ CẢNH • TẦNG 03</p><h2>Thí luyện Ma Uyên</h2></div><span className="turn-chip">{battle.phase === 'player' ? 'LƯỢT CỦA BẠN' : finished ? 'TRẬN ĐẤU KẾT THÚC' : 'ĐỐI THỦ ĐANG HÀNH ĐỘNG'}</span></div>
      <div className="arena">
        <div className="side"><h3>ĐỘI HÌNH GIA TỘC</h3>{battle.allies.map((unit) => <UnitCard key={unit.id} unit={unit} ally onAttack={() => onAttack(unit)} />)}</div>
        <div className="versus">VS<div className="battle-log" aria-live="polite">{battle.log.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div></div>
        <div className="side enemy-side"><h3>MA UYÊN</h3>{battle.foes.map((unit) => <UnitCard key={unit.id} unit={unit} ally={false} />)}</div>
      </div>
      {battle.phase === 'victory' && <div className="victory">✨ Bí cảnh đã chinh phục! +500 linh thạch</div>}
      {battle.phase === 'defeat' && <div className="defeat">☁ Đội hình đã kiệt sức. Hãy dưỡng thương rồi thử lại.</div>}
    </section>
  )
}
