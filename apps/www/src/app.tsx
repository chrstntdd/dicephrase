import { lazy, Suspense, Switch, Match, ComponentProps } from "solid-js"
import { MetaProvider } from "solid-meta"

import { SkipNavContent, SkipToContentLink } from "./components/skip-link"
import { OfflineToast } from "./lib/offline-toast"

const Generate = lazy(() => import("./views/generate"))
const About = lazy(() => import("./views/about"))

import * as styles from "./app.css"

const SKIP_NAV_ID = "app-skip-nav"

function App(props: {
  url: string
  tags: ComponentProps<typeof MetaProvider>["tags"]
}) {
  return (
    <MetaProvider tags={props.tags}>
      <SkipToContentLink
        contentId={SKIP_NAV_ID}
        aria-label="Skip to main content"
      />

      <header class={styles.header}>
        <h1 class={styles.pageTile}>
          <a href="/">Dicephrase</a>
        </h1>

        <nav>
          <a href="/about">About</a>
        </nav>
      </header>

      <SkipNavContent id={SKIP_NAV_ID} />

      <main class={styles.main}>
        <Suspense>
          <Switch fallback={<Generate />}>
            <Match when={props.url === "/"}>
              <Generate />
            </Match>

            <Match when={props.url === "/about"}>
              <About />
            </Match>
          </Switch>
        </Suspense>
      </main>

      <OfflineToast />
    </MetaProvider>
  )
}

export { App }
