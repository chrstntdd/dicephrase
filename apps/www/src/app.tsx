import {
	createSignal,
	createUniqueId,
	lazy,
	Match,
	Show,
	Suspense,
	Switch,
} from "solid-js"

import { SkipNavContent, SkipToContentLink } from "./components/skip-link"
import { OfflineToast } from "./lib/offline-toast"

const Generate = lazy(() => import("./views/generate"))
const About = lazy(() => import("./views/about"))
const BuildData = lazy(() => import("./features/build-data/build-data"))

import * as styles from "./app.css"

function App(props: { url: string }) {
	let [show, setShow] = createSignal(false)
	let skipId = createUniqueId()

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

			<div class={styles.buildMetadataContainer}>
				<button
					class={styles.buildMetadataToggle}
					type="button"
					aria-label="Show build metadata"
					onClick={() => {
						setShow((x) => !x)
					}}
				/>
				<Suspense>
					<Show when={show()} keyed>
						<BuildData />
					</Show>
				</Suspense>
			</div>

			<OfflineToast />
		</>
	)
}

export { App }
