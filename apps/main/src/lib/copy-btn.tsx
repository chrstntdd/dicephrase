import { createMemo, Show } from "solid-js"
import type { ActorRefFrom } from "xstate"

import type { generateMachine } from "../features/generate/generate.machine"

import * as styles from "./copy-btn.css"
import { useActor } from "./solid-xstate/use-actor"

export default function CopyBtn(props: {
  svc: ActorRefFrom<typeof generateMachine>
}) {
  let [state, send] = useActor(props.svc)

  let copied = createMemo(() => state().matches("idle.copied"))

  return (
    <button
      classList={{ [styles.copyBtn]: true }}
      aria-label="Copy to clipboard"
      onClick={() => {
        send("COPY_PHRASE")
      }}
    >
      <Show
        when={copied()}
        fallback={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className={styles.copyIcon}
          >
            <path
              fill="currentColor"
              d="M15 38q-1.2 0-2.1-1-.9-.9-.9-2V7q0-1.3.9-2.2.9-.8 2.1-.8h22q1.2 0 2.1.8.9 1 .9 2.2v28q0 1.1-.9 2-.9 1-2.1 1Zm0-3h22V7H15v28Zm-6 9q-1.2 0-2.1-1-.9-.9-.9-2V10.8h3V41h23.7v3Zm6-37v28V7Z"
            />
          </svg>
        }
      >
        <span class={styles.copiedEmoji} role="img" aria-label="copied">
          ✅
        </span>
      </Show>
    </button>
  )
}
