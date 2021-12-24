import * as styles from "./aria-live.css"

const cleanupStatus = (doc?: Document) => {
  setTimeout(() => {
    getStatusDiv(doc).textContent = ""
  }, 250)
}

function setStatus(
  status: string,
  { doc, assertive }: { doc?: Document; assertive?: boolean } = {}
) {
  const div = getStatusDiv(doc)
  if (!status) return

  div.setAttribute("aria-live", assertive ? "assertive" : "polite")
  div.textContent = status
  cleanupStatus(doc)
}

/**
 * Get the status node or create it if it does not already exist.
 * @param {Object} doc document passed by the user.
 * @return {HTMLElement} the status node.
 */
function getStatusDiv(doc = document) {
  let statusDiv = doc.getElementsByClassName(styles.statusNode)[0]

  if (statusDiv) return statusDiv

  statusDiv = doc.createElement("div")
  statusDiv.setAttribute("role", "status")
  statusDiv.setAttribute("aria-live", "polite")
  statusDiv.setAttribute("aria-relevant", "additions text")
  statusDiv.classList.add(styles.statusNode)
  doc.body.appendChild(statusDiv)

  return statusDiv
}

export { setStatus }
