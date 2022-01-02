import { onMount, lazy, createMemo, Show, createEffect } from "solid-js"

import { simpleGenerateMachine } from "../features/generate/generate-simple.machine"
import { useMachine } from "../lib/solid-xstate/use-machine"

import * as styles from "./generated-output.css"

const PhraseOutput = lazy(() => import("./phrase-output"))

function GeneratedOutput() {
  let [state, send, actor] = useMachine(
    simpleGenerateMachine,
    import.meta.env.DEV ? { devTools: true } : undefined
  )

  let separators = createMemo(() => state.context.separators)
  let phrases = createMemo(() => state.context.phrases)
  let hasOutput = createMemo(() => state.context.wlRecord)

  onMount(() => {
    send({
      type: "HYDRATE_FROM_URL_PARAMS",
      value: location.search
    })
  })

  return (
    <div>
      <Show when={hasOutput()}>
        <PhraseOutput
          service={actor}
          separators={separators()}
          phrases={phrases()}
          handleCopyPress={() => {
            send("COPY_PHRASE")
          }}
        />
      </Show>

      <a className={styles.backToGenerateLink} href="/generate">
        Generate another passphrase
      </a>
    </div>
  )
}

export default GeneratedOutput
