import * as styles from "./header.css"
export function Header() {
	return (
		<header class={styles.header}>
			<h1 class={styles.pageTile}>
				<a href="/">Dicephrase</a>
			</h1>

			<nav>
				<a href="/about">About</a>
			</nav>
		</header>
	)
}
