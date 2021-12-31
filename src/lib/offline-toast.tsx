import { useAriaLive } from "../lib/a11y/use-aria-live"

import * as styles from "./offline-toast.css"
import { onMount, createSignal } from "solid-js"

// assume we have sw before rendering this
function OfflineToast() {
  let [visualText, setVisualText] = createSignal("")
  let [vertTranslate, setVertTranslate] = createSignal(2.4)
  let { polite } = useAriaLive()

  onMount(() => {
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
  })

  return (
    <div
      className={styles.backdrop}
      hidden={!visualText}
      style={{ transform: `translate(-50%, ${vertTranslate()}rem)` }}
    >
      <div>{visualText}</div>
    </div>
  )
}

export { OfflineToast }
