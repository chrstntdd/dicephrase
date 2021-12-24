import { Generate } from "./views/generate"
import { GeneratedOutput } from "./views/generated-output"

import * as styles from "./app.css"

function App({ url }: { url: string }) {
  console.log({ url })

  return (
    <div className={styles.appGutter}>
      <h1 className={styles.pageTile}>
        <a href="/generate">Dicephrase</a>
      </h1>
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
    </div>
  )
}

export { App }
