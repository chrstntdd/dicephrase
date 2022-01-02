import { lazy, Suspense, Switch, Match } from "solid-js"

import { SkipNavContent, SkipToContentLink } from "./components/skip-link"
import OfflineToast from "./lib/offline-toast"

const Generate = lazy(() => import("./views/generate"))
const GeneratedOutput = lazy(() => import("./views/generated-output"))

import * as styles from "./app.css"

const SKIP_NAV_ID = "app-skip-nav"

function App(props: { url: string }) {
  return (
    <div className={styles.appGutter}>
      <SkipToContentLink
        contentId={SKIP_NAV_ID}
        aria-label="Skip to main content"
      />

      <header>
        <h1 className={styles.pageTile}>
          <a href="/generate">Dicephrase</a>
        </h1>
      </header>

      <SkipNavContent id={SKIP_NAV_ID} />

      <main>
        <Suspense>
          <Switch
            fallback={
              <div>
                Welcome! Start by generating a{" "}
                <a href="/generate">passphrase</a>
              </div>
            }
          >
            <Match when={props.url === "/generate"}>
              <Generate />
            </Match>

            <Match when={props.url === "/generated"}>
              <GeneratedOutput />
            </Match>
          </Switch>
        </Suspense>
      </main>

      <OfflineToast />
    </div>
  )
}

export { App }
