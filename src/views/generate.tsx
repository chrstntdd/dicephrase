import { RadioGroup } from "../components/radio-group"

import { GenerateProvider, useGenerate } from "../features/generate"
// import { PhraseOutput } from "./phrase-output"
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

  let phraseCount = generateActor.getSnapshot()!.context.count
  let separator = generateActor.getSnapshot()!.context.separatorKind
  // let isIdle = generateActor.getSnapshot()!.matches("idle")
  // let separators = generateActor.getSnapshot()!.context.separators
  // let phrases = generateActor.getSnapshot()!.context.phrases
  // let hasOutput = isIdle && separators && phrases

  let navToGeneratedPage = false

  function handleSubmit(e: Event) {
    generateActor.send("GENERATE")

    //
    if (!navToGeneratedPage) {
      e.preventDefault()
    }
  }

  return (
    <form action="/generated" className={styles.formEl} onSubmit={handleSubmit}>
      <fieldset
        onChange={(e) => {
          // generateActor.send({ type: "SET_COUNT", value: e.target.value })
        }}
      >
        <legend id={countId}>Word count</legend>
        <RadioGroup
          class={styles.baseRadioGroupContainer}
          value={phraseCount}
          name="phrase-count"
          labelledBy={countId}
        >
          {WORD_COUNT_OPTS}
        </RadioGroup>
      </fieldset>

      <fieldset
        onChange={(e) => {
          // generateActor.send({ type: "SET_SEP", value: e.target.value })
        }}
      >
        <legend id={separatorId}>Phrase separator</legend>
        <RadioGroup
          class={styles.baseRadioGroupContainer}
          value={separator}
          name="separator"
          labelledBy={separatorId}
        >
          {SEPARATOR_OPTS}
        </RadioGroup>
      </fieldset>

      <button className={styles.generateBtn} type="submit">
        Generate
      </button>
      {/* {hasOutput && (
        <PhraseOutput
          separators={separators}
          phrases={phrases}
          handleCopyPress={() => {
            generateActor.send("COPY_PHRASE")
          }}
        />
      )} */}
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
