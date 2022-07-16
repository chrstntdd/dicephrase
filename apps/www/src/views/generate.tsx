import { createMemo, Show, lazy, Suspense } from "solid-js"
import { Meta, Title } from "solid-meta"
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
import { generateMachine } from "../features/generate/generate.machine"
import { useMachine } from "../lib/solid-xstate/use-machine"

import * as styles from "./generate.css"

const PhraseOutput = lazy(() => import("./phrase-output"))
const CopyBtn = lazy(() => import("../lib/copy-btn"))

const countId = "word-count-gr"
const separatorId = "separator-gr"

const SEPARATOR_OPTS = [
	{ name: "space", value: VAL_SPACE, label: "Space", id: "sep-space" },
	{ name: "dash", value: VAL_DASH, label: "-", id: "sep-dash" },
	{ name: "period", value: VAL_PERIOD, label: ".", id: "sep-period" },
	{ name: "dollar", value: VAL_DOLLAR, label: "$", id: "sep-$" },
	{ name: "random", value: VAL_RANDOM, label: "Random", id: "sep-rand" },
]

const WORD_COUNT_OPTS = [
	{ value: 6, label: "6", id: "count-6" },
	{ value: 7, label: "7", id: "count-7" },
	{ value: 8, label: "8", id: "count-8" },
	{ value: 9, label: "9", id: "count-9" },
	{ value: 10, label: "10", id: "count-10" },
]

const FORM_ID = "gen-form"

function Generate() {
	let [state, send] = useMachine(
		generateMachine,
		import.meta.env.DEV ? { devTools: true } : undefined,
	)

	let phraseCount = createMemo(() => state.context.count)
	let separatorKind = createMemo(() => state.context.separatorKind)
	let separators = createMemo(() => state.context.separators)
	let phrases = createMemo(() => state.context.phrases)
	let hasOutput = createMemo(() => state.matches("ui.has_output"))
	let copied = createMemo(() => state.matches("ui.has_output.copying"))

	function handleSubmit(e: Event) {
		send("GENERATE")

		e.preventDefault()
	}

	function handleCopy() {
		send("COPY_PHRASE")
	}

	return (
		<section class={styles.generatePage}>
			<form id={FORM_ID} class={styles.formEl} onSubmit={handleSubmit}>
				<Title>Dicephrase | Generate</Title>
				<Meta property="og:image" content="/img/dicephrase-og.jpg" />
				<Meta property="og:title" content="Dicephrase | Generate" />
				<Meta
					property="og:description"
					content="Simple, random, and secure in-browser password generator"
				/>
				<Meta property="og:type" content="website" />
				<fieldset
					class={styles.fieldset}
					onChange={(e) => {
						let value = parse_count_val((e.target as HTMLInputElement).value)
						send({ type: "SET_COUNT", value })
					}}
				>
					<legend id={countId}>Word count</legend>
					<RadioGroup
						class={styles.baseRadioGroupContainer}
						value={phraseCount()}
						name={PHRASE_COUNT_KEY}
					>
						{WORD_COUNT_OPTS}
					</RadioGroup>
				</fieldset>

				<fieldset
					class={styles.fieldset}
					onChange={(e) => {
						send({
							type: "SET_SEP",
							value: (e.target as HTMLInputElement).value,
						})
					}}
				>
					<legend id={separatorId}>Word separator</legend>
					<RadioGroup
						class={styles.baseRadioGroupContainer}
						value={separatorKind()}
						name={SEPARATOR_KEY}
					>
						{SEPARATOR_OPTS}
					</RadioGroup>
				</fieldset>

				<button class={styles.generateBtn} type="submit">
					Generate
				</button>
			</form>

			{/* Another boundary to prevent the parent from flashing the empty fallback as this component is rendered */}
			<Suspense fallback="">
				<Show when={hasOutput()}>
					<>
						<CopyBtn copied={copied()} handleCopy={handleCopy} />
						<PhraseOutput
							formId={FORM_ID}
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							separators={separators()!}
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							phrases={phrases()!}
						/>
					</>
				</Show>
			</Suspense>
		</section>
	)
}

export default Generate
