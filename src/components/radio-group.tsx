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
      role="radiogroup"
      class={props.class}
    >
      <For each={props.children}>
        {(kid, i) => {
          return (
            <Radio
              label={kid.label}
              value={kid.value}
              name={props.name}
              id={`${props.name}-${i()}`}
              checked={props.value == kid.value}
            />
          )
        }}
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
        value={props.id}
      />
    </div>
  )
}

export { RadioGroup }
