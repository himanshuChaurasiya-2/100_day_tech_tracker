import { useState, useEffect, useRef } from 'react'

export function useCountUp(target, duration = 1600, delay = 0) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime = null
      const step = (ts) => {
        if (!startTime) startTime = ts
        const progress = Math.min((ts - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.floor(eased * target))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
      started.current = true
    }, delay)
    return () => clearTimeout(timeout)
  }, [target, duration, delay])

  return value
}
