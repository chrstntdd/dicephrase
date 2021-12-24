import React from "react"
import ReactDOM from "react-dom"

import "./styles/global.css"
import { App } from "./app"

let start = import.meta.env.PROD ? ReactDOM.hydrate : ReactDOM.render

start(
  <React.StrictMode>
    <App url={globalThis.location.pathname} />
  </React.StrictMode>,
  document.getElementById("root")
)
