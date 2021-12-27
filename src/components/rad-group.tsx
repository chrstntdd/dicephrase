import {
  useContext,
  createEffect,
  createSignal,
  createContext,
  For,
  createMemo
} from "solid-js"
import type { ReactNode, HTMLProps } from "react"

interface RadioGroupCtx<V = unknown> {
  lastIndex: number
  registerDescendant: (el: HTMLElement, val: V) => void
  setChecked: (activeIdx: number) => void
  value: V
  name: string
}

let RadioGroupContext = createContext({})
let RadioGroupIndexCtx = createContext<number | null>(undefined as any)

type RadioGroupProps<V = unknown> = {
  children: ReactNode[]
  labelledBy: string
  onChange: (value: V) => void
  className?: string
  value: V
  /** @description Names the group */
  name: string
}

function RadioGroup<V>(props: RadioGroupProps<V>) {
  let [descendants, setDescendants] = createSignal<
    { el: HTMLElement; val: V }[]
  >([])

  let setChecked = (activeIdx: number) => {
    let desc = descendants().find((_, index) => activeIdx === index)

    if (!desc) return

    desc.el.focus()

    props.onChange?.(desc.val)
  }

  let registerDescendant = (el: HTMLElement, val: V) => {
    setDescendants((prev) => {
      // includes
      if (prev.find((s) => s.el === el)) {
        return prev
      }
      let descItem = { el, val }
      return [...prev, descItem]
    })
  }

  let lastIndex = props.children.length - 1

  let ctx = createMemo<RadioGroupCtx<V>>(() => ({
    registerDescendant,
    setChecked,
    name: props.name,
    value: props.value,
    lastIndex
  }))

  return (
    <RadioGroupContext.Provider value={ctx()}>
      <div aria-labelledby={props.labelledBy} role="radiogroup" {...props}>
        <For each={props.children}>
          {(kid, index) => (
            <RadioGroupIndexCtx.Provider value={index()}>
              {kid}
            </RadioGroupIndexCtx.Provider>
          )}
        </For>
      </div>
    </RadioGroupContext.Provider>
  )
}

type RadioProps<V extends string> = {
  children: ReactNode
  id: string
  label: string
  onBlur?: (e: FocusEvent) => void
  onFocus?: (e: FocusEvent) => void
  value: V
} & Omit<HTMLProps<HTMLInputElement>, "onBlur" | "onFocus">

function Radio<V extends string>(props: RadioProps<V>) {
  let ref: HTMLDivElement
  let ctx = useContext(RadioGroupContext) as RadioGroupCtx<V>
  let index = useContext(RadioGroupIndexCtx)!

  let isCurrentRadioSelected = createMemo(() => ctx.value == props.value)

  createEffect(() => {
    if (ref) {
      ctx.registerDescendant?.(ref, props.value)
    }
  })

  return (
    <div data-checked={isCurrentRadioSelected()} ref={ref}>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        checked={isCurrentRadioSelected()}
        id={props.id}
        name={ctx.name}
        onChange={() => {
          ctx.setChecked(index)
        }}
        type="radio"
        value={ctx.value}
      />
    </div>
  )
}

export { RadioGroup, Radio }
export type { RadioGroupProps, RadioProps }
