import { useEffect } from "react"
import { useSelector } from "@xstate/react"

import { PhraseOutput } from "./phrase-output"

import * as styles from "./generated-output.css"
import {
  SimpleGenerateProvider,
  useGenerate
} from "../features/generate/provider-simple"

function GeneratedOutputImpl() {
  let generateActor = useGenerate()
  let separators = useSelector(generateActor, (x) => x.context.separators)
  let phrases = useSelector(generateActor, (x) => x.context.phrases)
  let isIdle = useSelector(generateActor, (x) => x.matches("idle"))
  let hasOutput = isIdle && phrases && separators

  useEffect(() => {
    generateActor.send({
      type: "HYDRATE_FROM_URL_PARAMS",
      value: location.search
    })
  }, [])

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
