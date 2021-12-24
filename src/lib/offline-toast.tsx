import { useEffect, useState } from "react"

import { useSpring } from "./use-spring"
import { useAriaLive } from "../lib/a11y/use-aria-live"

import * as styles from "./offline-toast.css"

let SPRING_CONFIG = { stiffness: 230, damping: 12, mass: 0.4, decimals: 2 }

// assume we have sw before rendering this
function OfflineToast() {
  let [visualText, setVisualText] = useState("")
  let [vertTranslate, setVertTranslate] = useState(2.4)
  let { polite } = useAriaLive()

  useEffect(() => {
    let handle: ReturnType<typeof setTimeout> | undefined
    navigator.serviceWorker.addEventListener("message", (swEvent) => {
      let msg = swEvent?.data?.type

      switch (msg) {
        case "PRECACHE_SUCCESS": {
          setVertTranslate(0)
          let msg = "Ready to work offline"
          setVisualText(msg)
          polite(msg)

          handle = setTimeout(() => {
            setVisualText("")
            setVertTranslate(2.4)
          }, 5000)
        }
      }
    })

    return () => {
      if (handle) {
        clearTimeout(handle)
      }
    }
  }, [])

  let sprungTrans = useSpring(vertTranslate, SPRING_CONFIG)[0]

  return (
    <div
      className={styles.backdrop}
      hidden={!visualText}
      style={{ transform: `translate(-50%, ${sprungTrans}rem)` }}
    >
      <div>{visualText}</div>
    </div>
  )
}

export { OfflineToast }
