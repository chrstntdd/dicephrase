import { SVGWrapper } from "../lib/svg-wrapper"

import * as styles from "./about.css"

function About() {
	return (
		<section class={styles.aboutPage}>
			<h1>About</h1>
			<p class={styles.tagline}>
				Simple, random, and secure in-browser password generator{" "}
				<a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps">
					<abbr title="Progressive Web App">PWA</abbr>
				</a>
				.
			</p>

			<h2>Why</h2>
			<p>
				Coming up with strong passwords is tough. Strong passwords fulfill at
				least these 3 criteria.
			</p>
			<ul>
				<li>
					Random — Avoid any personal association (
					<a href="http://www.loper-os.org/bad-at-entropy/manmach.html">
						People are terrible at being random
					</a>
					)
				</li>
				<li>
					Unique — If/when your password is compromised, no other accounts are
					affected
				</li>
				<li>Long — For increased complexity</li>
			</ul>
			<p>
				Sure, maybe your password manager will generate passwords for you too,
				but this app does{" "}
				<a href="https://en.wikipedia.org/wiki/Unix_philosophy">
					Just One Thing
				</a>
				.
			</p>

			<h2>How</h2>
			<p>
				This app uses the{" "}
				<a href="https://theworld.com/~reinhold/diceware.html">
					diceware method
				</a>{" "}
				to create passwords.
			</p>
			<p>
				Under the hood, this means the rolling of dice is <em>simulated</em> on
				your device as the source of entropy powered by JavaScript's{" "}
				<a href="https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues">
					<code class={styles.inlineCode}>crypto.getRandomValues</code>
				</a>
				.
			</p>
			<p>
				The result of each roll is joined to form a 5 digit numeric key such as{" "}
				<samp>63522</samp>, which is used to find the corresponding word on{" "}
				<a href="https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt">
					the 2016 <abbr title="Electronic Frontier Foundation">EFF</abbr>{" "}
					wordlist
				</a>
				.
			</p>
			<p>
				Finally, separators are spliced between each word based to your
				settings.
			</p>

			<h2>Privacy</h2>
			<p>Everything happens within your browser entirely on your device.</p>
			<ul>
				<li>No cookies or browser storage</li>
				<li>No analytics</li>
				<li>No server-side logic</li>
				<li>
					Strict{" "}
					<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy">
						<abbr title="Content Security Policy">CSP</abbr>
					</a>
				</li>
				<li>
					<a href="https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes#full-strict">
						Full (strict) SSL from Cloudflare
					</a>
				</li>
			</ul>

			<h2>Credit</h2>
			<ul>
				<li>
					<cite>
						<a href="https://securephrase.io">
							Kyle Simpson&#39;s implementation
						</a>
					</cite>
					, which directly inspired this project
				</li>
				<li>
					<cite>
						<a href="https://theworld.com/~reinhold/diceware.html">
							Original Diceware webpage
						</a>
					</cite>
				</li>
			</ul>

			<h2>Tech</h2>
			<ul>
				<li>
					<a href="https://www.solidjs.com/">Solid</a>
				</li>
				<li>
					<a href="https://xstate.js.org/">XState</a>
				</li>
				<li>
					<a href="https://vanilla-extract.style/">Vanilla Extract</a>
				</li>
				<li>
					<a href="https://rescript-lang.org/">ReScript</a>
				</li>
				<li>
					<a href="https://www.typescriptlang.org/">TypeScript</a>
				</li>
				<li>
					<a href="https://vitejs.dev/">Vite</a>
				</li>
				<li>
					<a href="https://vitest.dev/">Vitest</a>
				</li>
				<li>
					<a href="https://playwright.dev/">Playwright</a>
				</li>
				<li>
					<a href="https://esbuild.github.io/">esbuild</a>
				</li>
				<li>
					<a href="https://pnpm.io/">pnpm</a>
				</li>
			</ul>

			<footer class={styles.appFooter}>
				<a
					class={styles.sourceLink}
					aria-label="View source on GitHub"
					href="https://github.com/chrstntdd/dicephrase"
				>
					<SVGWrapper>
						<svg
							class={styles.ghLogo}
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
					</SVGWrapper>
				</a>
			</footer>
		</section>
	)
}

export default About
