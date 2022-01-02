import * as styles from "./offline-toast.css"
import { onMount, createSignal, onCleanup } from "solid-js"

import { setStatus } from "../lib/a11y/aria-live-msg.js"

function OfflineToast() {
  let [visualText, setVisualText] = createSignal("")
  let [vertTranslate, setVertTranslate] = createSignal(2.4)

  onMount(() => {
    let handle: ReturnType<typeof setTimeout> | undefined

    navigator.serviceWorker.addEventListener("message", (swEvent) => {
      let msg = swEvent?.data?.type

      switch (msg) {
        case "PRECACHE_SUCCESS": {
          setVertTranslate(0)
          let msg = "Ready to work offline"
          setVisualText(msg)
          setStatus(msg)

          handle = setTimeout(() => {
            setVisualText("")
            setVertTranslate(2.4)
          }, 5000)
        }
      }
    })

    onCleanup(() => {
      if (handle) {
        clearTimeout(handle)
      }
    })
  })

  return (
    <div
      className={styles.backdrop}
      style={{ transform: `translate(-50%, ${vertTranslate()}rem)` }}
    >
      <div>{visualText()}</div>
    </div>
  )
}

export default OfflineToast
