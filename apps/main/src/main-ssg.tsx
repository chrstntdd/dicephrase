/**
 * @description
 * Server side app entry to get a plain ol html string for prerendering
 * or just SSR.
 */
import { renderToStringAsync, HydrationScript } from "solid-js/web"
import { renderTags } from "solid-meta"
import { App } from "./app"

async function render(url: string) {
  let headTags: any[] = []
  let html = await renderToStringAsync(() => <App url={url} tags={headTags} />)
  let renderedHeadTags = renderTags(headTags)
  let hydrationScript = await renderToStringAsync(() => <HydrationScript />)

  return { html, hydrationScript, renderedHeadTags } as const
}

export { render }
