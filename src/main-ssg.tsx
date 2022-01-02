/**
 * @description
 * Server side app entry to get a plain ol html string for prerendering
 * or just SSR.
 */
import { renderToStringAsync, generateHydrationScript } from "solid-js/web"
import { App } from "./app"

async function render(url: string) {
  let html = await renderToStringAsync(() => <App url={url} />)
  let hydrationScript = generateHydrationScript()

  return { html, hydrationScript }
}

export { render }
