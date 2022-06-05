import type { JSXElement } from "solid-js"

export function SVGWrapper(props: { children: JSXElement }) {
  return <span aria-hidden={true}>{props.children}</span>
}
