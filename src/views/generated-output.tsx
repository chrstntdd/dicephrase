import { onMount } from "solid-js"

import { PhraseOutput } from "./phrase-output"

import * as styles from "./generated-output.css"
import {
  SimpleGenerateProvider,
  useGenerate
} from "../features/generate/provider-simple"

function GeneratedOutputImpl() {
  let generateActor = useGenerate()

  let phraseCount = generateActor.getSnapshot()!.context.count
  let separator = generateActor.getSnapshot()!.context.separatorKind
  let isIdle = generateActor.getSnapshot()!.matches("idle")
  let separators = generateActor.getSnapshot()!.context.separators
  let phrases = generateActor.getSnapshot()!.context.phrases
  let hasOutput = isIdle && separators && phrases

  onMount(() => {
    generateActor.send({
      type: "HYDRATE_FROM_URL_PARAMS",
      value: location.search
    })
  })

  return (
    <div>
      Here is your passphrase:
      {hasOutput && (
        <PhraseOutput
          separators={separators}
          phrases={phrases}
          handleCopyPress={() => {
            generateActor.send("COPY_PHRASE")
          }}
        />
      )}
      <a className={styles.backToGenerateLink} href="/generate">
        Generate another passphrase
      </a>
    </div>
  )
}

function GeneratedOutput() {
  return (
    <SimpleGenerateProvider>
      <GeneratedOutputImpl />
    </SimpleGenerateProvider>
  )
}

export { GeneratedOutput }
