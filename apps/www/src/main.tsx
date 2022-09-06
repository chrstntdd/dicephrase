import { render, hydrate } from "solid-js/web"

import "./styles/base.css"
import "./styles/global.css"
import { App } from "./app"

let start = import.meta.env.PROD ? hydrate : render

start(
	() => <App url={/*@once*/ globalThis.location.pathname} />,
	document.getElementById("root") as HTMLElement,
)
