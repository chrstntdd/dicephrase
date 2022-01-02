import { For, Match, Switch } from "solid-js"
import { ActorRefFrom } from "xstate"

import { Nothing } from "../components/nothing"
import { simpleGenerateMachine } from "../features/generate/generate-simple.machine"
import { generateMachine } from "../features/generate/generate.machine"
import { useActor } from "../lib/solid-xstate/use-actor"

import * as styles from "./phrase-output.css"

function PhraseOutput(props: {
  phrases: string[]
  separators: string[]
  handleCopyPress: () => void
  service: any
}) {
  let phrasesExist = !!props.phrases.length
  let [state, send] = useActor<
    ActorRefFrom<typeof simpleGenerateMachine | typeof generateMachine>
  >(props.service)

  function handleCopyPhrase() {
    send("COPY_PHRASE")
  }

  return (
    <div>
      <Help
        status={
          state().matches("idle.phrase_output.focused.idle")
            ? "copy"
            : state().matches("idle.phrase_output.focused.copied")
            ? "copied"
            : "idle"
        }
      />
      <button
        type="button"
        aria-label="Copy passphrase to clipboard"
        class={styles.pressable}
        hidden={!phrasesExist}
        tabIndex={phrasesExist ? 0 : -1}
        onFocus={() => {
          send("FOCUS_OUTPUT")
        }}
        onBlur={() => {
          send("BLUR_OUTPUT")
        }}
        onClick={phrasesExist ? handleCopyPhrase : undefined}
      >
        <div class={styles.phrases}>
          <For each={props.phrases}>
            {(phrase, index) => {
              let isLast = index() === props.phrases.length - 1
              let sep = props.separators[index()]

              return (
                <>
                  <Word content={phrase} />
                  {isLast ? <Nothing /> : <Word content={sep} />}
                </>
              )
            }}
          </For>
        </div>
      </button>
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

function Word(props: { content: string }) {
  return (
    <div class={styles.word}>
      <For each={props.content.split("")}>
        {(char, index) => <Char offset={index() * 22} content={char} />}
      </For>
    </div>
  )
}

function Char(props: { content: string; offset: number }) {
  return (
    <span
      class={styles.phraseChar}
      style={{ "animation-delay": `${props.offset}ms` }}
    >
      {props.content}
    </span>
  )
}

export default PhraseOutput
