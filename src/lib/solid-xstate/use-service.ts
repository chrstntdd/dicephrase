import { onCleanup } from "solid-js"
import { createStore } from "solid-js/store"

import type { EventObject, Typestate, Interpreter } from "xstate"

function useService<
  TContext,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = any
>(service: Interpreter<TContext, any, TEvent, TTypestate>) {
  const [state, setState] = createStore({
    ...service.initialState,
    matches(...args: Parameters<typeof service.state.matches>): boolean {
      // access state to track on value access
      state.value

      return service.state.matches(...args)
    }
  })

  let c = service.subscribe((s) => {
    setState(s)
  })

  onCleanup(() => c.unsubscribe())

  return [state, service.send] as const
}

export { useService }
