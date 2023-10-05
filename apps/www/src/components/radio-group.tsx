import { createUniqueId, For } from "solid-js"

function RadioGroup<V>(props: {
	class: string
	name: string
	opts: ReadonlyArray<{ value: V; label?: string }>
	value: V
}) {
	return (
		<ul class={/*@once*/ props.class}>
			<For each={/*@once*/ props.opts}>
				{(kid) => (
					<Radio
						checked={props.value === kid.value}
						label={/*@once*/ kid.label ?? `${kid.value}`}
						name={/*@once*/ props.name}
						value={/*@once*/ kid.value}
					/>
				)}
			</For>
		</ul>
	)
}

function Radio<V>(props: {
	checked: boolean
	label: string
	name: string
	value: V
}) {
	let linkingId = createUniqueId()

	return (
		<li>
			<input
				type="radio"
				checked={props.checked}
				id={linkingId}
				name={/*@once*/ props.name}
				value={/*@once*/ props.value as unknown as string}
			/>
			<label for={linkingId}>{props.label}</label>
		</li>
	)
}

export { RadioGroup }
