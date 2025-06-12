import { useState } from 'react'

const usePause = () => {
  const [isPaused, setIsPaused] = useState(false)

  const pause = async (duration: number): Promise<void> => {
    setIsPaused(true)
    
return new Promise((resolve) => {
      setTimeout(() => {
        setIsPaused(false)
        resolve()
      }, duration)
    })
  }

  return { isPaused, pause }
}

export default usePause