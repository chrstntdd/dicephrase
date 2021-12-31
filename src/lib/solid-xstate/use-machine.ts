import { onCleanup, batch, startTransition } from "solid-js"
import { createStore } from "solid-js/store"
import { interpret } from "xstate"
import type { StateMachine, EventObject } from "xstate"

/* FORKED FROM https://codesandbox.io/s/xstate-solid-example-dgpd7?from-embed=&file=/useMachine.js:0-1088 */

// WARNING: This is a PoC and a bit hacky
// I could have done a gone with treating the store as simple signal
// like Svelte, React, Vue implementations.
// Instead wanted to see if with a little hacking we could make
// it work granularly.This should improve performance on larger objects.
export function useMachine<C, S, E extends EventObject>(
  machine: StateMachine<C, S, E>,
  options: Parameters<typeof interpret>[1]
) {
  let service = interpret(machine, options).start()

  let [state, setState] = createStore({
    ...service.initialState,
    matches(...args: Parameters<typeof service.state.matches>): boolean {
      // access state to track on value access
      state.value
      return service.state.matches(...args)
    }
  })

  service.onTransition((s) => {
    // only focus on stuff that actually changes
    if (s.changed) {
      batch(() => {
        setState("value", s.value)
        // diff data to only update values that changes
        setState("context", s.context)
      })
    }
  })

  onCleanup(() => service.stop())

  return [state, service.send, service] as const
}
