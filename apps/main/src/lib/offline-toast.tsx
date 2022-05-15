import { onMount, createSignal, onCleanup, Show } from "solid-js"

import { Toast } from "./toast"

function OfflineToast() {
  let [show, setShow] = createSignal(true)

  onMount(() => {
    let msgHandler = (swEvent: MessageEvent) => {
      let msg = swEvent?.data?.type

      switch (msg) {
        case "PRECACHE_SUCCESS": {
          setShow(true)
        }
      }
    }

    navigator.serviceWorker.addEventListener("message", msgHandler)

    onCleanup(() => {
      navigator.serviceWorker.removeEventListener("message", msgHandler)
    })
  })

  return (
    <Show when={show()}>
      <Toast msg="Ready to work offline" showTime={5000} />
    </Show>
  )
}

export default OfflineToast
