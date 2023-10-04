import { For, Show } from "solid-js"
import { combine_zip } from "gen-utils"

import * as styles from "./phrase-output.css"

function PhraseOutput(props: {
	phrases: ReadonlyArray<string>
	separators: ReadonlyArray<string>
	formId: string
}) {
	return (
		<>
			{/* Announce generated phrase to screen readers */}
			<output
				role="status"
				aria-live="polite"
				form={props.formId}
				class={/*@once*/ styles.outputEl}
			>
				{combine_zip(
					props.phrases as Array<string>,
					props.separators as Array<string>,
				).join("")}
			</output>
			<div class={/*@once*/ styles.phrases}>
				<For each={props.phrases}>
					{(phrase, index) => {
						let idx = index()
						let isLast = idx === props.phrases.length - 1
						let sep = props.separators[idx] ?? ""

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
		</>
	)
}

function Word(props: { content: string; sep?: boolean }) {
	return (
		<div>
			<For each={props.content.split("")}>
				{(char, index) => (
					<span
						data-sep={/*@once*/ props.sep}
						style={/*@once*/ `--ad:${index() * 22}`}
					>
						{char}
					</span>
				)}
			</For>
		</div>
	)
}

export default PhraseOutput
