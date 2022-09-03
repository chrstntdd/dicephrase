import { createUniqueId, For } from "solid-js"

function RadioGroup<V>(props: {
	class: string
	name: string
	opts: {
		value: V
		label: string
		id: string
	}[]
	value: V
}) {
	return (
		<ul class={props.class}>
			<For each={props.opts}>
				{(kid) => (
					<Radio
						checked={props.value === kid.value}
						label={/*@once*/ kid.label}
						name={/*@once*/ props.name}
						value={kid.value}
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
			<label for={linkingId}>{props.label}</label>
			<input
				type="radio"
				checked={props.checked}
				id={linkingId}
				name={props.name}
				value={props.value as unknown as string}
			/>
		</li>
	)
}

export { RadioGroup }
