import { createContext, useContext } from "solid-js"
import type { ActorRefFrom } from "xstate"
import { useMachine } from "../../lib/solid-xstate/use-machine"

import { simpleGenerateMachine } from "./generate-simple.machine"

const SimpleGenCtx = createContext<ActorRefFrom<typeof simpleGenerateMachine>>(
  undefined as any
)

function SimpleGenerateProvider(props: { children: any }) {
  let actor = useMachine(simpleGenerateMachine, { devTools: true })[2]

  return (
    <SimpleGenCtx.Provider value={actor}>
      {props.children}
    </SimpleGenCtx.Provider>
  )
}

function useGenerate() {
  return useContext(SimpleGenCtx)
}

export { SimpleGenerateProvider, useGenerate }
