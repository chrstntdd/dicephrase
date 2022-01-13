import { For, Match, Switch, Show } from "solid-js"
import type { ActorRefFrom } from "xstate"

import type { simpleGenerateMachine } from "../features/generate/generate-simple.machine"
import type { generateMachine } from "../features/generate/generate.machine"
import { useActor } from "../lib/solid-xstate/use-actor"

import * as styles from "./phrase-output.css"

function PhraseOutput(props: {
  phrases: readonly string[]
  separators: readonly string[]
  handleCopyPress: () => void
  service: ActorRefFrom<typeof simpleGenerateMachine | typeof generateMachine>
}) {
  let phrasesExist = !!props.phrases.length
  let [state, send] = useActor(props.service)

  return (
    <div>
      <Help
        status={
          state().matches("idle.focused.idle")
            ? "copy"
            : state().matches("idle.focused.copied")
            ? "copied"
            : "idle"
        }
      />
      {/* Unable to use a native button due to children & safari  */}
      {/* being safari https://stackoverflow.com/questions/42758815/safari-focus-event-doesnt-work-on-button-element */}
      <div
        role="button"
        tabIndex={phrasesExist ? 0 : -1}
        aria-label="Copy passphrase to clipboard"
        class={styles.pressable}
        hidden={!phrasesExist}
        onFocus={() => {
          send("FOCUS_OUTPUT")
        }}
        onBlur={() => {
          send("BLUR_OUTPUT")
        }}
        onClick={
          phrasesExist
            ? () => {
                send("COPY_PHRASE")
              }
            : undefined
        }
      >
        <div class={styles.phrases}>
          <For each={props.phrases}>
            {(phrase, index) => {
              let isLast = index() === props.phrases.length - 1
              let sep = props.separators[index()]

              return (
                <>
                  <Word content={phrase} />
                  <Show when={!isLast}>
                    <Word content={sep} sep />
                  </Show>
                </>
              )
            }}
          </For>
        </div>
      </div>
    </div>
  )
}

function Help(props: { status: "idle" | "copy" | "copied" }) {
  return (
    <div data-hide={props.status === "idle"} class={styles.helpText}>
      <Switch>
        <Match when={props.status === "copy"}>
          <>
            Copy to clipboard
            <span role="img" aria-label="clipboard">
              📋
            </span>
          </>
        </Match>

        <Match when={props.status === "copied"}>
          <>
            Copied to clipboard
            <span role="img" aria-label="memo">
              📝
            </span>
          </>
        </Match>
      </Switch>
    </div>
  )
}

function Word(props: { content: string; sep?: boolean }) {
  return (
    <div class={styles.word}>
      <For each={props.content.split("")}>
        {(char, index) => (
          <Char offset={index() * 22} content={char} sep={props.sep} />
        )}
      </For>
    </div>
  )
}

function Char(props: { content: string; offset: number; sep?: boolean }) {
  return (
    <span
      class={styles.phraseChar}
      data-sep={props.sep}
      style={{ "animation-delay": `${props.offset}ms` }}
    >
      {props.content}
    </span>
  )
}

export default PhraseOutput
