import { Show } from "solid-js"
import { Toast } from "./toast"

import * as styles from "./copy-btn.css"

export default function CopyBtn(props: {
	copied: boolean
	handleCopy: () => void
}) {
	return (
		<button
			class={/*@once */ styles.copyBtn}
			aria-label="Copy to clipboard"
			onClick={props.handleCopy}
		>
			<Show when={props.copied}>
				<Toast msg="Copied to clipboard" />
			</Show>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 48 48"
				class={/*@once*/ styles.copyIcon}
				aria-hidden
			>
				<path
					fill="currentColor"
					d="M15 38q-1.2 0-2.1-1-.9-.9-.9-2V7q0-1.3.9-2.2.9-.8 2.1-.8h22q1.2 0 2.1.8.9 1 .9 2.2v28q0 1.1-.9 2-.9 1-2.1 1Zm0-3h22V7H15v28Zm-6 9q-1.2 0-2.1-1-.9-.9-.9-2V10.8h3V41h23.7v3Zm6-37v28V7Z"
				/>
			</svg>
		</button>
	)
}
