import {
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
  createElement,
  ReactFragment
} from "react"
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
  as?: keyof HTMLElementTagNameMap
  children: ReactNode[]
  labelledBy: string
  onChange: (value: V) => void
  className?: string
  value: V
  /** @description Names the group */
  name: string
}

function RadioGroup<V>({
  as,
  children,
  labelledBy,
  value,
  onChange,
  ...props
}: RadioGroupProps<V>) {
  let [descendants, setDescendants] = useState<{ el: HTMLElement; val: V }[]>(
    []
  )

  let setChecked = (activeIdx: number) => {
    let desc = descendants.find((_, index) => activeIdx === index)

    if (!desc) return

    desc.el.focus()

    onChange?.(desc.val)
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

  let lastIndex = children.length - 1

  let ctx: RadioGroupCtx<V> = {
    registerDescendant,
    setChecked,
    name: props.name,
    value,
    lastIndex
  }

  return (
    <RadioGroupContext.Provider value={ctx}>
      {createElement(
        as || "div",
        { "aria-labelledby": labelledBy, role: "radiogroup", ...props },
        children.map((kid, index) => {
          return (
            <RadioGroupIndexCtx.Provider key={index} value={index}>
              {kid}
            </RadioGroupIndexCtx.Provider>
          )
        })
      )}
    </RadioGroupContext.Provider>
  )
}

type RadioProps<V extends string> = {
  as?: keyof HTMLElementTagNameMap | ReactFragment
  children: ReactNode
  id: string
  label: string
  onBlur?: (e: FocusEvent) => void
  onFocus?: (e: FocusEvent) => void
  value: V
} & Omit<HTMLProps<HTMLInputElement>, "onBlur" | "onFocus">

function Radio<V extends string>({
  as,
  children,
  onBlur,
  onFocus,
  value: valueProp,
  ...props
}: RadioProps<V>) {
  let ref = useRef<HTMLDivElement | null>(null)
  let ctx = useContext(RadioGroupContext) as RadioGroupCtx<V>
  let index = useContext(RadioGroupIndexCtx)!
  let { registerDescendant, setChecked, value, name } = ctx
  let isCurrentRadioSelected = value == valueProp

  useEffect(() => {
    if (ref.current) {
      registerDescendant(ref.current, valueProp)
    }
  }, [valueProp])

  return createElement(
    as || "div",
    {
      ref,
      "data-checked": isCurrentRadioSelected
    },
    <label htmlFor={props.id}>{props.label}</label>,
    <input
      defaultChecked={isCurrentRadioSelected}
      id={props.id}
      name={name}
      onChange={() => {
        setChecked(index)
      }}
      type="radio"
      value={value}
    />
  )
}

export { RadioGroup, Radio }
export type { RadioGroupProps, RadioProps }
