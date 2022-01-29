import { createMemo, Show, lazy, Suspense } from "solid-js"
import { parse_count_val } from "gen-utils"

import { RadioGroup } from "../components/radio-group"
import { generateMachine } from "../features/generate/generate.machine"
import { useMachine } from "../lib/solid-xstate/use-machine"
import { PHRASE_COUNT_KEY, SEPARATOR_KEY } from "../features/generate/constants"

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

function Generate() {
  let [state, send, service] = useMachine(
    // @ts-expect-error Typing kinda sux with the handrolled useMachine
    // Once it's merged, we should use the official solid useMachine
    // https://github.com/statelyai/xstate/pull/2932
    generateMachine,
    import.meta.env.DEV ? { devTools: true } : undefined
  )

  let phraseCount = createMemo(() => state.context.count)
  let separator = createMemo(() => state.context.separatorKind)
  let separators = createMemo(() => state.context.separators)
  let phrases = createMemo(() => state.context.phrases)
  let hasOutput = createMemo(() => state.context.wlRecord)

  function handleSubmit(e: Event) {
    send("GENERATE")

    e.preventDefault()
  }

  return (
    <form action="/generated" class={styles.formEl} onSubmit={handleSubmit}>
      <fieldset
        onChange={(e) => {
          let value = parse_count_val((e.target as HTMLInputElement).value)
          send({ type: "SET_COUNT", value })
        }}
      >
        <legend id={countId}>Word count</legend>
        <RadioGroup
          class={styles.baseRadioGroupContainer}
          value={phraseCount()}
          name={PHRASE_COUNT_KEY}
          labelledBy={countId}
        >
          {WORD_COUNT_OPTS}
        </RadioGroup>
      </fieldset>

      <fieldset
        onChange={(e) => {
          send({ type: "SET_SEP", value: (e.target as HTMLInputElement).value })
        }}
      >
        <legend id={separatorId}>Word separator</legend>
        <RadioGroup
          class={styles.baseRadioGroupContainer}
          value={separator()}
          name={SEPARATOR_KEY}
          labelledBy={separatorId}
        >
          {SEPARATOR_OPTS}
        </RadioGroup>
      </fieldset>

      <button class={styles.generateBtn} type="submit">
        Generate
      </button>

      {/* Another boundary to prevent the parent from flashing the empty fallback as this component is rendered */}
      <Suspense>
        <Show when={hasOutput()}>
          <PhraseOutput
            service={service}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            separators={separators()!}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            phrases={phrases()!}
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
