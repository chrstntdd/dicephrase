import { lazy, Suspense, Switch, Match } from "solid-js"

import { SkipNavContent, SkipToContentLink } from "./components/skip-link"

const Generate = lazy(() => import("./views/generate"))
const GeneratedOutput = lazy(() => import("./views/generated-output"))
const OfflineToast = lazy(() => import("./lib/offline-toast"))

import * as styles from "./app.css"

const SKIP_NAV_ID = "app-skip-nav"

function App({ url }: { url: string }) {
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

      <Suspense>
        <main>
          <Switch
            fallback={
              <div>
                Welcome! Start by generating a{" "}
                <a href="/generate">passphrase</a>
              </div>
            }
          >
            <Match when={url === "/generate"}>
              <Generate />
            </Match>

            <Match when={url === "/generated"}>
              <GeneratedOutput />
            </Match>
          </Switch>
        </main>

        <Switch>
          <Match
            when={
              globalThis.navigator && "serviceWorker" in globalThis.navigator
            }
          >
            <OfflineToast />
          </Match>
        </Switch>
      </Suspense>
    </div>
  )
}

export { App }
