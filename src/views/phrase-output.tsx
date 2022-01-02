import {
  createEffect,
  createSignal,
  For,
  Match,
  onCleanup,
  Switch
} from "solid-js"
import { Nothing } from "../components/nothing"
import { useAriaLive } from "../lib/a11y/use-aria-live"

import * as styles from "./phrase-output.css"

function PhraseOutput(props: {
  phrases: string[]
  separators: string[]
  handleCopyPress: () => void
}) {
  let [status, setStatus] = createSignal<"idle" | "hidden" | "copy" | "copied">(
    "idle"
  )
  let toastTimerRef: ReturnType<typeof setTimeout>
  let phrasesExist = !!props.phrases.length

  function hideToast() {
    setStatus("hidden")
  }

  function clearDismissTimer() {
    if (toastTimerRef) {
      clearTimeout(toastTimerRef)
    }
  }

  function handleCopyPhrase() {
    clearDismissTimer()

    props.handleCopyPress()
    setStatus("copied")

    toastTimerRef = setTimeout(hideToast, 4000)
  }

  onCleanup(() => {
    clearDismissTimer()
  })

  return (
    <div>
      <Help status={status()} />
      <button
        type="button"
        aria-label="Copy passphrase to clipboard"
        class={styles.pressable}
        hidden={!phrasesExist}
        tabIndex={phrasesExist ? 0 : -1}
        onFocus={() => {
          setStatus("copy")
        }}
        onBlur={() => {
          setStatus("idle")
          clearDismissTimer()
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

/**
 * lil help text. Rendered alongside the phrase output. Hidden to
 * begin with,
 * 1. appears as "copy" first when focus enters the button
 * 2. obvs indicates the act of copying
 * 3. dimisses after a short period
 */
function Help(props: { status: "idle" | "hidden" | "copy" | "copied" }) {
  let [vertTranslate, setVertTranslate] = createSignal(-0.6)
  let { polite } = useAriaLive()

  createEffect(() => {
    if (props.status === "hidden" || props.status === "idle") {
      setVertTranslate(-0.6)
    } else if (props.status === "copy" || props.status === "copied") {
      setVertTranslate(0)
    }
  })

  createEffect(() => {
    if (props.status === "copy") {
      polite("Copy to clipboard")
    }

    if (props.status === "copied") {
      polite("Copied to clipboard")
    }
  })

  return (
    <div
      class={styles.helpText}
      style={{ transform: `translate(-50%, ${vertTranslate()}rem)` }}
    >
      <Switch fallback={<Nothing />}>
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
