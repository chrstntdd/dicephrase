import { onMount, lazy, createMemo } from "solid-js"

import * as styles from "./generated-output.css"
import {
  SimpleGenerateProvider,
  useGenerate
} from "../features/generate/provider-simple"
import { simpleGenerateMachine } from "../features/generate/generate-simple.machine"
import { useMachine } from "../lib/solid-xstate/use-machine"

const PhraseOutput = lazy(() => import("./phrase-output"))

function GeneratedOutput() {
  let [state, send] = useMachine(simpleGenerateMachine, { devTools: true })

  // let phraseCount = createMemo(() => state.context.count)
  // let separator = createMemo(() => state.context.separatorKind)
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
      {hasOutput() && (
        <PhraseOutput
          separators={separators()}
          phrases={phrases()}
          handleCopyPress={() => {
            send("COPY_PHRASE")
          }}
        />
      )}
      <a className={styles.backToGenerateLink} href="/generate">
        Generate another passphrase
      </a>
    </div>
  )
}

export default GeneratedOutput
