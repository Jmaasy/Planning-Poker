import { useEffect, useRef } from "react"

const useEventListener = (eventName: string, eventHandler: any) => {
    const cbRef = useRef(eventHandler)
  
    useEffect(() => {
      cbRef.current = eventHandler
    }) // update after each render
  
    useEffect(() => {
        const cb = (e: any) => cbRef.current(e) // then use most recent cb value
        window.addEventListener(eventName, cb)
        return () => {
            window.removeEventListener(eventName, cb)
        }
    }, [eventName])
    return
}

export default useEventListener;