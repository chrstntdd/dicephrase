import { Generate } from "./views/generate"
import { GeneratedOutput } from "./views/generated-output"
import { OfflineToast } from "./lib/offline-toast"
import { Nothing } from "./components/nothing"
import { SkipNavContent, SkipToContentLink } from "./components/skip-link"

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

      <main>
        {url === "/generate" ? (
          <Generate />
        ) : /* Match query params for count and separator */
        url === "/generated" ? (
          <GeneratedOutput />
        ) : (
          <div>
            Welcome! Start by generating a <a href="/generate">passphrase</a>
          </div>
        )}
      </main>
      {globalThis.navigator && "serviceWorker" in globalThis.navigator ? (
        <OfflineToast />
      ) : (
        <Nothing />
      )}
    </div>
  )
}

export { App }
