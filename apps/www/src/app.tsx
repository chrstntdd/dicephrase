import { lazy, Suspense, Switch, Match, createUniqueId } from "solid-js"

import { SkipNavContent, SkipToContentLink } from "./components/skip-link"
import { OfflineToast } from "./lib/offline-toast"

const Generate = lazy(() => import("./views/generate"))
const About = lazy(() => import("./views/about"))

import * as styles from "./app.css"

function App(props: { url: string }) {
	const skipId = createUniqueId()
	return (
		<>
			<SkipToContentLink id={/*@once*/ skipId} />

			<header class={styles.header}>
				<h1 class={styles.pageTile}>
					<a href="/">Dicephrase</a>
				</h1>

				<nav>
					<a href="/about">About</a>
				</nav>
			</header>

			<SkipNavContent id={/*@once*/ skipId} />

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
		</>
	)
}

export { App }
