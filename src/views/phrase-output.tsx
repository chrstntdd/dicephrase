import { Nothing } from "../components/nothing"
import { useSpring } from "../lib/use-spring"
import { useAriaLive } from "../lib/a11y/use-aria-live"

import * as styles from "./phrase-output.css"
import { createEffect, createSignal, onCleanup, onMount } from "solid-js"

let SPRING_CONFIG = { stiffness: 230, damping: 12, mass: 0.4, decimals: 2 }

function PhraseOutput({
  phrases,
  separators,
  handleCopyPress
}: {
  phrases: string[]
  separators: string[]
  handleCopyPress: () => void
}) {
  let [status, setStatus] = createSignal<"idle" | "hidden" | "copy" | "copied">(
    "idle"
  )
  let toastTimerRef: ReturnType<typeof setTimeout>
  let phrasesExist = !!phrases.length

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

    handleCopyPress()
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
        className={styles.pressable}
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
        <div className={styles.phrases}>
          {phrases.map((phrase, index) => {
            let offset = index * 17
            let isLast = index === phrases.length - 1
            let sep = separators[index]

            return (
              <>
                <Word content={phrase} offset={offset} />
                {isLast ? <Nothing /> : <Word content={sep} offset={offset} />}
              </>
            )
          })}
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
function Help({ status }: { status: "idle" | "hidden" | "copy" | "copied" }) {
  let [vertTranslate, setVertTranslate] = createSignal(-0.6)
  let sprungTrans = useSpring(vertTranslate(), SPRING_CONFIG)[0]
  let { polite } = useAriaLive()

  createEffect(() => {
    if (status === "hidden" || status === "idle") {
      setVertTranslate(-0.6)
    } else if (status === "copy" || status === "copied") {
      setVertTranslate(0)
    }
  })

  createEffect(() => {
    if (status === "copy") {
      polite("Copy to clipboard")
    }

    if (status === "copied") {
      polite("Copied to clipboard")
    }
  })

  let hasContent = status === "copied" || status === "copy"

  return (
    <div
      className={styles.helpText}
      style={{ transform: `translate(-50%, ${sprungTrans}rem)` }}
      hidden={!hasContent}
    >
      {status === "copy" ? (
        <>
          Copy to clipboard{" "}
          <span role="img" aria-label="clipboard">
            📋
          </span>
        </>
      ) : status === "copied" ? (
        <>
          Copied to clipboard{" "}
          <span role="img" aria-label="memo">
            📝
          </span>
        </>
      ) : (
        <Nothing />
      )}
    </div>
  )
}

function Word({ content, offset }: { content: string; offset: number }) {
  let [arrived, setArrived] = createSignal(false)

  onMount(() => {
    let handle = setTimeout(() => {
      setArrived(true)
    }, offset)

    return () => {
      if (handle) {
        clearTimeout(handle)
      }
    }
  })

  return (
    <div className={styles.word} style={{ opacity: arrived() ? 1 : 0 }}>
      {content.split("").map((char, index) => {
        return <Char arrived={arrived()} offset={index * 22} content={char} />
      })}
    </div>
  )
}

function Char({
  content,
  offset,
  arrived
}: {
  content: string
  offset: number
  arrived: boolean
}) {
  let [verticalTranslate, setVerticalTranslate] = createSignal(36)
  let [sprungTrans] = useSpring(verticalTranslate(), SPRING_CONFIG)

  createEffect(() => {
    let handle = setTimeout(() => {
      if (arrived) {
        setVerticalTranslate(0)
      }
    }, offset)

    return () => {
      if (handle) {
        clearTimeout(handle)
      }
    }
  })

  let unanimated = verticalTranslate() === 36

  return (
    <span
      className={styles.phraseChar}
      style={{
        transform: `translateY(${unanimated ? 0 : sprungTrans}px)`,
        opacity: unanimated ? 0 : 1
      }}
    >
      {content}
    </span>
  )
}

export { PhraseOutput }
