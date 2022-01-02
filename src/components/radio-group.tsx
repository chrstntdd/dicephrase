import { For } from "solid-js"

function RadioGroup(props: {
  class: string
  name: string
  labelledBy: string
  children: any[]
  value: string | number
}) {
  return (
    <div
      aria-labelledby={props.labelledBy}
      class={props.class}
      role="radiogroup"
    >
      <For each={props.children}>
        {(kid, i) => (
          <Radio
            checked={props.value == kid.value}
            id={`${props.name}-${i()}`}
            label={kid.label}
            name={props.name}
            value={kid.value}
          />
        )}
      </For>
    </div>
  )
}

function Radio(props: {
  label: string
  name: string
  id: string
  value: number | string
  checked: boolean
}) {
  return (
    <div>
      <label for={props.id}>{props.label}</label>
      <input
        type="radio"
        checked={props.checked}
        id={props.id}
        name={props.name}
        value={props.value}
      />
    </div>
  )
}

export { RadioGroup }
