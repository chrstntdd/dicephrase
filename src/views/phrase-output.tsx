import { Nothing } from "../components/nothing"
import { useSpring } from "../lib/use-spring"
import { useAriaLive } from "../lib/a11y/use-aria-live"

import * as styles from "./phrase-output.css"
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  onCleanup,
  onMount,
  Switch
} from "solid-js"

let SPRING_CONFIG = { stiffness: 230, damping: 12, mass: 0.4, decimals: 2 }

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

  /* Ensure cleanup */
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
              let offset = index() * 17
              let isLast = index() === props.phrases.length - 1
              let sep = props.separators[index()]

              return (
                <>
                  <Word content={phrase} offset={offset} />
                  {isLast ? (
                    <Nothing />
                  ) : (
                    <Word content={sep} offset={offset} />
                  )}
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
  // let sprungTrans = useSpring(vertTranslate(), SPRING_CONFIG)[0]
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

  let hasContent = createMemo(
    () => props.status === "copied" || props.status === "copy"
  )

  return (
    <div
      class={styles.helpText}
      style={{ transform: `translate(-50%, ${vertTranslate()}rem)` }}
      hidden={!hasContent()}
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

function Word(props: { content: string; offset: number }) {
  let [arrived, setArrived] = createSignal(false)

  onMount(() => {
    let handle = setTimeout(() => {
      setArrived(true)
    }, props.offset)

    return () => {
      if (handle) {
        clearTimeout(handle)
      }
    }
  })

  return (
    <div class={styles.word} style={{ opacity: arrived() ? 1 : 0 }}>
      <For each={props.content.split("")}>
        {(char, index) => {
          return (
            <Char arrived={arrived()} offset={index() * 22} content={char} />
          )
        }}
      </For>
    </div>
  )
}

function Char(props: { content: string; offset: number; arrived: boolean }) {
  // let [verticalTranslate, setVerticalTranslate] = createSignal(36)
  // let sprungTrans = useSpring(verticalTranslate(), SPRING_CONFIG)[0]

  // createEffect(() => {
  //   let handle = setTimeout(() => {
  //     if (props.arrived) {
  //       setVerticalTranslate(0)
  //     }
  //   }, props.offset)

  //   return () => {
  //     if (handle) {
  //       clearTimeout(handle)
  //     }
  //   }
  // })

  // let unanimated = createMemo(() => verticalTranslate() === 36)

  return (
    <span
      class={styles.phraseChar}
      // style={
      //   {
      // transform: `translateY(${unanimated() ? 0 : sprungTrans}px)`
      // opacity: unanimated() ? 0 : 1
      //   }
      // }
    >
      {props.content}
    </span>
  )
}

export { PhraseOutput }
