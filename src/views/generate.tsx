import { useState } from "react"
import type { FormEvent } from "react"

import { RadioGroup, Radio } from "../components/rad-group"
import { usePassphrase } from "../lib/use-passphrase"

import { PhraseOutput } from "./phrase-output"
import * as styles from "./generate.css"

const countId = "word-count-gr"
const separatorId = "separator-gr"

const SEPARATOR_OPTS = [
  { name: "space", value: "\u00a0", label: "Space", id: "sep-space" },
  { name: "dash", value: "-", label: "-", id: "sep-dash" },
  { name: "period", value: ".", label: ".", id: "sep-period" },
  { name: "dollar", value: "$", label: "$", id: "sep-$" },
  { name: "random", value: "random", label: "Random", id: "sep-rand" }
]

const WORD_COUNT_OPTS = [
  { value: 6, label: "6", id: "count-6" },
  { value: 7, label: "7", id: "count-7" },
  { value: 8, label: "8", id: "count-8" },
  { value: 9, label: "9", id: "count-9" },
  { value: 10, label: "10", id: "count-10" }
]

function Generate() {
  let [phraseCount, setPhraseCount] = useState(WORD_COUNT_OPTS[0].value)
  let [separator, setSeparator] = useState(
    SEPARATOR_OPTS[SEPARATOR_OPTS.length - 1].value
  )

  let [{ phrases, separators }, { generate, saveToClipboard }] = usePassphrase()

  let navToGeneratedPage = false

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    generate(e.currentTarget)

    //
    if (!navToGeneratedPage) {
      e.preventDefault()
    }
  }

  return (
    <form action="/generated" className={styles.formEl} onSubmit={handleSubmit}>
      <fieldset>
        <legend id={countId}>Word count</legend>
        <RadioGroup
          className={styles.baseRadioGroupContainer}
          labelledBy={countId}
          name="phrase-count"
          onChange={setPhraseCount}
          value={phraseCount}
        >
          {WORD_COUNT_OPTS.map((opt) => {
            return (
              <Radio
                id={opt.id}
                label={opt.label}
                value={opt.value as unknown as string}
                key={opt.id}
              >
                <span>{opt.label}</span>
              </Radio>
            )
          })}
        </RadioGroup>
      </fieldset>

      <fieldset>
        <legend id={separatorId}>Phrase separator</legend>
        <RadioGroup
          className={styles.baseRadioGroupContainer}
          labelledBy={separatorId}
          name="separator"
          onChange={setSeparator}
          value={separator}
        >
          {SEPARATOR_OPTS.map((opt) => {
            return (
              <Radio
                id={opt.id}
                label={opt.label}
                value={opt.value as unknown as string}
                key={opt.id}
              >
                <span>{opt.label}</span>
              </Radio>
            )
          })}
        </RadioGroup>
      </fieldset>

      <button className={styles.generateBtn} type="submit">
        Generate
      </button>
      {separators && phrases && (
        <PhraseOutput
          handleCopyPress={saveToClipboard}
          separators={separators}
          phrases={phrases}
        />
      )}
    </form>
  )
}

export { Generate }
