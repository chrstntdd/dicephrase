import type { FormEvent } from "react"
import { useSelector } from "@xstate/react"

import { RadioGroup, Radio } from "../components/rad-group"

import { GenerateProvider, useGenerate } from "../features/generate"
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

function GenerateImpl() {
  let generateActor = useGenerate()
  let phraseCount = useSelector(generateActor, (x) => x.context.count)
  let separator = useSelector(generateActor, (x) => x.context.separatorKind)
  let isIdle = useSelector(generateActor, (x) => x.matches("idle"))
  let separators = useSelector(generateActor, (x) => x.context.separators)
  let phrases = useSelector(generateActor, (x) => x.context.phrases)
  let hasOutput = isIdle && separators && phrases

  let navToGeneratedPage = false

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    generateActor.send("GENERATE")

    //
    if (!navToGeneratedPage) {
      e.preventDefault()
    }
  }

  function handlePhraseCountChange(value: number) {
    generateActor.send({ type: "SET_COUNT", value })
  }

  function handleSeparatorChange(value: string) {
    generateActor.send({ type: "SET_SEP", value })
  }

  return (
    <form action="/generated" className={styles.formEl} onSubmit={handleSubmit}>
      <fieldset>
        <legend id={countId}>Word count</legend>
        <RadioGroup
          className={styles.baseRadioGroupContainer}
          labelledBy={countId}
          name="phrase-count"
          onChange={handlePhraseCountChange}
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
          onChange={handleSeparatorChange}
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
      {hasOutput && (
        <PhraseOutput
          separators={separators}
          phrases={phrases}
          handleCopyPress={() => {
            generateActor.send("COPY_PHRASE")
          }}
        />
      )}
    </form>
  )
}

function Generate() {
  return (
    <GenerateProvider>
      <GenerateImpl />
    </GenerateProvider>
  )
}

export { Generate }
