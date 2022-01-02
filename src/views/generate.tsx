import { RadioGroup } from "../components/radio-group"

import { number } from "@badrap/valita"
import { createMemo, Show, lazy, Suspense } from "solid-js"

import { generateMachine } from "../features/generate/generate.machine"
import { useMachine } from "../lib/solid-xstate/use-machine"

import * as styles from "./generate.css"

const PhraseOutput = lazy(() => import("./phrase-output"))

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

let countDecoder = number()

function Generate() {
  let [state, send] = useMachine(generateMachine, { devTools: true })

  let phraseCount = createMemo(() => state.context.count)
  let separator = createMemo(() => state.context.separatorKind)
  let separators = createMemo(() => state.context.separators)
  let phrases = createMemo(() => state.context.phrases)
  let hasOutput = createMemo(() => state.context.wlRecord)

  let navToGeneratedPage = false

  function handleSubmit(e: Event) {
    send("GENERATE")

    if (!navToGeneratedPage) {
      e.preventDefault()
    }
  }

  return (
    <form action="/generated" className={styles.formEl} onSubmit={handleSubmit}>
      <fieldset
        onChange={(e) => {
          let rawVal = parseInt(e.target.value, 10)
          let value = countDecoder.parse(rawVal)
          send({ type: "SET_COUNT", value })
        }}
      >
        <legend id={countId}>Word count</legend>
        <RadioGroup
          class={styles.baseRadioGroupContainer}
          value={phraseCount()}
          name="phrase-count"
          labelledBy={countId}
        >
          {WORD_COUNT_OPTS}
        </RadioGroup>
      </fieldset>

      <fieldset
        onChange={(e) => {
          send({ type: "SET_SEP", value: e.target.value })
        }}
      >
        <legend id={separatorId}>Word separator</legend>
        <RadioGroup
          class={styles.baseRadioGroupContainer}
          value={separator()}
          name="separator"
          labelledBy={separatorId}
        >
          {SEPARATOR_OPTS}
        </RadioGroup>
      </fieldset>

      <button className={styles.generateBtn} type="submit">
        Generate
      </button>

      {/* Another boundary to prevent the parent from flashing the empty fallback as this component is rendered */}
      <Suspense>
        <Show when={hasOutput()}>
          <PhraseOutput
            separators={separators()}
            phrases={phrases()}
            handleCopyPress={() => {
              send("COPY_PHRASE")
            }}
          />
        </Show>
      </Suspense>
    </form>
  )
}

export default Generate
