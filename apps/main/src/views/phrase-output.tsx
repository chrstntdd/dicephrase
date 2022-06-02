import { For, Show } from "solid-js"
import { combine_zip } from "gen-utils"

import * as styles from "./phrase-output.css"

function PhraseOutput(props: {
  phrases: readonly string[]
  separators: readonly string[]
  handleCopyPress: () => void
  formId: string
}) {
  return (
    <>
      {/* Announce generated phrase to screen readers */}
      <output
        role="status"
        aria-live="polite"
        form={props.formId}
        class={styles.outputEl}
      >
        {combine_zip(
          props.phrases as string[],
          props.separators as string[]
        ).join("")}
      </output>
      <div class={styles.phrases}>
        <For each={props.phrases}>
          {(phrase, index) => {
            let idx = index()
            let isLast = idx === props.phrases.length - 1
            let sep = props.separators[idx]

            return (
              <>
                <Word content={phrase} />
                <Show when={!isLast}>
                  <Word content={sep || ""} sep />
                </Show>
              </>
            )
          }}
        </For>
      </div>
    </>
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
