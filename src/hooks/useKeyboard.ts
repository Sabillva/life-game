import { useEffect, useRef } from 'react'

export type KeyMap = {
  KeyW: boolean
  KeyA: boolean
  KeyS: boolean
  KeyD: boolean
  ArrowUp: boolean
  ArrowLeft: boolean
  ArrowDown: boolean
  ArrowRight: boolean
}

const TRACKED_KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight',
])

/**
 * useKeyboard
 * Returns a stable ref whose `.current` always reflects which
 * tracked keys are held right now.
 *
 * Deliberately uses a ref (not state) so key events never trigger
 * React re-renders — all reads happen inside useFrame.
 */
export function useKeyboard(): React.RefObject<KeyMap> {
  const keys = useRef<KeyMap>({
    KeyW: false, KeyA: false, KeyS: false, KeyD: false,
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
  })

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (TRACKED_KEYS.has(e.code)) {
        e.preventDefault()
        keys.current[e.code as keyof KeyMap] = true
      }
    }
    const onUp = (e: KeyboardEvent) => {
      if (TRACKED_KEYS.has(e.code)) {
        keys.current[e.code as keyof KeyMap] = false
      }
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup',   onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup',   onUp)
    }
  }, [])

  return keys
}
