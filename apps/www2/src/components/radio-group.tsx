import { For } from "solid-js"

function RadioGroup<V>(props: {
	class: string
	name: string
	opts: ReadonlyArray<{ value: V; label?: string }>
	value: V
}) {
	return (
		<ul class={props.class}>
			<For each={props.opts}>
				{(kid, index) => (
					<Radio
						checked={props.value === kid.value}
						label={kid.label || `${kid.value}`}
						name={props.name}
						value={kid.value}
						id={`${props.name}-${index()}`}
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
	id: string
}) {
	return (
		<li>
			<input
				type="radio"
				checked={props.checked}
				id={props.id}
				name={props.name}
				value={props.value as unknown as string}
			/>
			<label for={props.id}>{props.label}</label>
		</li>
	)
}

export { RadioGroup }
