/**
 * @description
 * Server side app entry to get a plain ol html string for prerendering
 * or just SSR.
 */
import { renderToString } from "react-dom/server"
import { App } from "./app"

async function render(url: string) {
  let vnode = <App url={url} />

  let html = renderToString(vnode)

  return { html }
}

export { render }
