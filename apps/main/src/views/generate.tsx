import { createMemo, Show, lazy, Suspense } from "solid-js"
import {
  parse_count_val,
  VAL_SPACE,
  VAL_DASH,
  VAL_PERIOD,
  VAL_DOLLAR,
  VAL_RANDOM,
  PHRASE_COUNT_KEY,
  SEPARATOR_KEY
} from "gen-utils"

import { RadioGroup } from "../components/radio-group"
import { generateMachine } from "../features/generate/generate.machine"
import { useMachine } from "../lib/solid-xstate/use-machine"

import * as styles from "./generate.css"
import type { ActorRefFrom } from "xstate"

const PhraseOutput = lazy(() => import("./phrase-output"))

const countId = "word-count-gr"
const separatorId = "separator-gr"

const SEPARATOR_OPTS = [
  { name: "space", value: VAL_SPACE, label: "Space", id: "sep-space" },
  { name: "dash", value: VAL_DASH, label: "-", id: "sep-dash" },
  { name: "period", value: VAL_PERIOD, label: ".", id: "sep-period" },
  { name: "dollar", value: VAL_DOLLAR, label: "$", id: "sep-$" },
  { name: "random", value: VAL_RANDOM, label: "Random", id: "sep-rand" }
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
    <form class={styles.formEl} onSubmit={handleSubmit}>
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
            // Oh boy
            service={service as any as ActorRefFrom<typeof generateMachine>}
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
