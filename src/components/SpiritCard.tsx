import type { Spirit } from '../domain/gameTypes'

type SpiritCardProps = {
  spirit: Spirit
}

export function SpiritCard({ spirit }: SpiritCardProps) {
  return (
    <article className="spirit-card">
      <div className="spirit-art">
        <span aria-hidden="true">{spirit.icon}</span>
        <label>{spirit.rarity}</label>
      </div>
      <div className="spirit-info">
        <div>
          <h3>{spirit.name}</h3>
          <span className={`element ${spirit.element}`}>{spirit.element} • {spirit.role}</span>
        </div>
        <strong>{spirit.power}</strong>
      </div>
      <div className="mini-bar"><i style={{ width: `${Math.min(100, spirit.power / 10)}%` }} /></div>
    </article>
  )
}
