import { useEffect, useState } from 'react'
import { assetManifest } from '../data/assetManifest'

type SummonModalProps = {
  onClose: () => void
  onSummon: (count: number) => void
}

export function SummonModal({ onClose, onSummon }: SummonModalProps) {
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), 900)
    return () => window.clearTimeout(timer)
  }, [])
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Triệu hồi linh thú">
      <div className={`summon-modal ${revealed ? 'revealed' : ''}`}>
        <button className="modal-close" onClick={onClose} aria-label="Đóng">×</button>
        <p className="eyebrow">TỤ LINH ĐÀI</p>
        <h2>{revealed ? 'Linh thú giáng thế' : 'Đang khai mở linh trận...'}</h2>
        <div className="summon-gate"><div className="summon-silhouette">{revealed ? <img src={assetManifest.spirits.fireFox} alt="Linh thú triệu hồi" /> : '☯'}</div><div className="summon-ring" /></div>
        {revealed ? <><p className="summon-result">Hỏa Hồ Ly · SSR</p><div className="summon-modal-actions"><button className="primary" onClick={() => { onSummon(1); onClose() }}>Nhận linh thú</button><button onClick={onClose}>Đóng</button></div></> : <p className="summon-hint">Sức mạnh của linh thú sẽ được quyết định bởi thiên cơ.</p>}
      </div>
    </div>
  )
}
