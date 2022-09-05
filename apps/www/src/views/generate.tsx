import { Show, lazy, Suspense } from "solid-js"
import {
	parse_count_val,
	VAL_SPACE,
	VAL_DASH,
	VAL_PERIOD,
	VAL_DOLLAR,
	VAL_RANDOM,
	PHRASE_COUNT_KEY,
	SEPARATOR_KEY,
} from "gen-utils"

import { RadioGroup } from "../components/radio-group"
import { useGenerate } from "../features/generate/use-generate"

import * as styles from "./generate.css"

const PhraseOutput = lazy(() => import("./phrase-output"))
const CopyBtn = lazy(() => import("../lib/copy-btn"))

const SEPARATOR_OPTS = [
	{ value: VAL_SPACE, label: "Space" },
	{ value: VAL_DASH, label: "-" },
	{ value: VAL_PERIOD, label: "." },
	{ value: VAL_DOLLAR, label: "$" },
	{ value: VAL_RANDOM, label: "Random" },
]

const WORD_COUNT_OPTS = [
	{ value: 6 },
	{ value: 7 },
	{ value: 8 },
	{ value: 9 },
	{ value: 10 },
]

const FORM_ID = "gen-form"

function Generate() {
	let { ctx, state, send, handleCopy, copyState } = useGenerate()

	function handleSubmit(e: Event) {
		e.preventDefault()
		send({ type: "GENERATE" })
	}

	return (
		<section class={/*@once*/ styles.generatePage}>
			<form
				id={FORM_ID}
				class={/*@once*/ styles.formEl}
				onSubmit={handleSubmit}
			>
				<fieldset
					class={/*@once*/ styles.fieldset}
					onChange={(e) => {
						let value = parse_count_val((e.target as HTMLInputElement).value)
						send({ type: "SET_COUNT", value })
					}}
				>
					<legend>Word count</legend>
					<RadioGroup
						class={/*@once*/ styles.baseRadioGroupContainer}
						value={ctx.phraseCount()}
						name={PHRASE_COUNT_KEY}
						opts={WORD_COUNT_OPTS}
					/>
				</fieldset>

				<fieldset
					class={/*@once*/ styles.fieldset}
					onChange={(e) => {
						send({
							type: "SET_SEP",
							value: (e.target as HTMLInputElement).value,
						})
					}}
				>
					<legend>Word separator</legend>
					<RadioGroup
						class={/*@once*/ styles.baseRadioGroupContainer}
						value={ctx.separatorKind()}
						name={SEPARATOR_KEY}
						opts={SEPARATOR_OPTS}
					/>
				</fieldset>

				<button class={/*@once*/ styles.generateBtn} type="submit">
					Generate
				</button>
			</form>

			{/* Another boundary to prevent the parent from flashing the empty fallback as this component is rendered */}
			<Suspense fallback="">
				<Show when={state() === "idle-with-output"}>
					<>
						<CopyBtn
							copied={copyState() === "copied"}
							handleCopy={handleCopy}
						/>
						<PhraseOutput
							formId={FORM_ID}
							separators={ctx.separators()}
							phrases={ctx.phrases()}
						/>
					</>
				</Show>
			</Suspense>
		</section>
	)
}

export default Generate
