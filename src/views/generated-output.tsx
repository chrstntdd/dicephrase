import { useEffect } from "react"

import { usePassphrase } from "../lib/use-passphrase"
import { PhraseOutput } from "./phrase-output"

import * as styles from "./generated-output.css"

function GeneratedOutput() {
  let [{ phrases, separators }, { generate, saveToClipboard }] = usePassphrase()

  useEffect(() => {
    generate(location.search)
  }, [])

  return (
    <div>
      Here is your passphrase:
      {separators && phrases && (
        <PhraseOutput
          handleCopyPress={saveToClipboard}
          separators={separators}
          phrases={phrases}
        />
      )}
      <a className={styles.backToGenerateLink} href="/generate">
        Generate another passphrase
      </a>
    </div>
  )
}

export { GeneratedOutput }
