import { nowISO, version, gitHash } from "virtual:build-info"

import * as styles from "./build-data.css"

export default function BuildData() {
	let dtf = new Intl.DateTimeFormat(undefined, { dateStyle: "short" })
	return (
		<div class={styles.buildDataContainer}>
			<div class={styles.releaseTime}>
				Released <time datetime={nowISO}>{dtf.format(new Date(nowISO))}</time>
			</div>
			|<code>v{version}</code>|
			<a
				class={styles.gitHash}
				href={`https://github.com/chrstntdd/dicephrase/commit/${gitHash}`}
			>
				<code class={styles.codeContainer}>{gitHash}</code>
			</a>
		</div>
	)
}
