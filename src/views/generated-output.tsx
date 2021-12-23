import { useEffect } from "react"

import { usePassphrase } from "../lib/use-passphrase"

function GeneratedOutput() {
  let [{ phrases, separators }, { generate }] = usePassphrase()

  useEffect(() => {
    generate(location.search)
  }, [])

  return (
    <div>
      Here is your passphrase:
      <h2>{phrases?.join("")}</h2>
      <a href="/generate">Generate another passphrase</a>
    </div>
  )
}

export { GeneratedOutput }
