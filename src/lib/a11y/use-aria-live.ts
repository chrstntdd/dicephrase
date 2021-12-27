import { setStatus } from "./aria-live-msg"

function useAriaLive() {
  return {
    polite: (msg: string) => {
      setStatus(msg)
    },
    assertive: (msg: string) => {
      setStatus(msg, { assertive: true })
    }
  }
}

export { useAriaLive }
