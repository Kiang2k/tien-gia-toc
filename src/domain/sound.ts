let audioContext: AudioContext | null = null

export const playUiTone = (enabled: boolean, frequency = 440) => {
  if (!enabled || typeof window === 'undefined') return
  audioContext ??= new AudioContext()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.04, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.18)
  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.18)
}
