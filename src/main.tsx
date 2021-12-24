import React from "react"
import ReactDOM from "react-dom"

import "./styles/global.css"
import { App } from "./app"

ReactDOM.hydrate(
  <React.StrictMode>
    <App url={globalThis.location.pathname} />
  </React.StrictMode>,
  document.getElementById("root")
)
