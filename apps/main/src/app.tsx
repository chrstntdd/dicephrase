import { lazy, Suspense, Switch, Match } from "solid-js"

import { SkipNavContent, SkipToContentLink } from "./components/skip-link"
import OfflineToast from "./lib/offline-toast"

const Generate = lazy(() => import("./views/generate"))
const GeneratedOutput = lazy(() => import("./views/generated-output"))
const About = lazy(() => import("./views/about"))

import * as styles from "./app.css"

const SKIP_NAV_ID = "app-skip-nav"

function App(props: { url: string }) {
  return (
    <div class={styles.appGutter}>
      <SkipToContentLink
        contentId={SKIP_NAV_ID}
        aria-label="Skip to main content"
      />

      <header class={styles.header}>
        <h1 class={styles.pageTile}>
          <a href="/generate">Dicephrase</a>
        </h1>

        <nav>
          <a href="/about">About</a>
        </nav>
      </header>

      <SkipNavContent id={SKIP_NAV_ID} />

      <main>
        <Suspense>
          <Switch fallback={<Generate />}>
            <Match when={props.url === "/generate"}>
              <Generate />
            </Match>

            <Match when={props.url === "/generated"}>
              <GeneratedOutput />
            </Match>

            <Match when={props.url === "/about"}>
              <About />
            </Match>
          </Switch>
        </Suspense>
      </main>

      <OfflineToast />
    </div>
  )
}

export { App }
