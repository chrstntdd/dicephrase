import { lazy, Suspense, Switch, Match } from "solid-js"
import { MetaProvider } from "solid-meta"

import { SkipNavContent, SkipToContentLink } from "./components/skip-link"
import OfflineToast from "./lib/offline-toast"

const Generate = lazy(() => import("./views/generate"))
const About = lazy(() => import("./views/about"))

import * as styles from "./app.css"

const SKIP_NAV_ID = "app-skip-nav"

function App(props: { url: string; tags: any[] }) {
  return (
    <MetaProvider tags={props.tags}>
      <div class={styles.appGutter}>
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

        <main>
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
        <footer class={styles.appFooter}>
          <a
            class={styles.sourceLink}
            href="https://github.com/chrstntdd/dicephrase"
          >
            <svg
              class={styles.ghLogo}
              aria-hidden="hidden"
              clip-rule="evenodd"
              fill-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="2"
              viewBox="0 0 136 133"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M67.9 0a67.9 67.9 0 0 0-21.5 132.3c3.4.6 4.6-1.5 4.6-3.3v-11.5c-19 4-22.9-9.1-22.9-9.1-3-7.9-7.5-10-7.5-10-6.2-4.2.4-4 .4-4 6.8.4 10.4 7 10.4 7 6 10.3 16 7.3 19.8 5.5.6-4.3 2.3-7.3 4.3-9-15-1.7-31-7.6-31-33.6 0-7.4 2.7-13.4 7-18.2a25 25 0 0 1 .7-18s5.7-1.8 18.7 7a65 65 0 0 1 34 0c13-8.8 18.6-7 18.6-7 3.7 9.4 1.4 16.3.7 18 4.3 4.8 7 10.8 7 18.2 0 26.1-15.9 31.8-31 33.5 2.4 2.1 4.6 6.3 4.6 12.6l-.1 18.6c0 1.8 1.2 4 4.7 3.3A67.9 67.9 0 0 0 67.9 0"
                fill="currentColor"
              />
            </svg>
            View source
          </a>
        </footer>
      </div>
    </MetaProvider>
  )
}

export { App }
