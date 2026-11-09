import { useState } from 'react'

type AssetImageProps = {
  src: string
  fallback: string
  alt: string
  className?: string
}

export function AssetImage({ src, fallback, alt, className }: AssetImageProps) {
  const [failed, setFailed] = useState(false)
  return <img className={className} src={failed ? fallback : src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
}
