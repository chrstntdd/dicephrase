/**
 * @description
 * Server side app entry to get a plain ol html string for prerendering
 * or just SSR.
 */
import { renderToString } from "solid-js/web"
import { App } from "./app"

async function render(url: string) {
  let html = renderToString(() => <App url={url} />)

  return { html }
}

export { render }
