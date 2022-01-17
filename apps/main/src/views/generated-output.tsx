import { onMount, lazy, createMemo, Show } from "solid-js"

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
  let hasOutput = createMemo(
    () =>
      state.context.wlRecord ||
      (state.context.separators && state.context.phrases)
  )

  onMount(() => {
    send("HYDRATE_FROM_EDGE")
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

      <a class={styles.backToGenerateLink} href="/generate">
        Generate another passphrase
      </a>
    </div>
  )
}

export default GeneratedOutput
