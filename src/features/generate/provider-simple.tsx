import { createContext, useContext } from "react"
import type { ReactNode } from "react"
import type { ActorRefFrom } from "xstate"
import { useMachine } from "@xstate/react"

import { simpleGenerateMachine } from "./generate-simple.machine"

const SimpleGenCtx = createContext<ActorRefFrom<typeof simpleGenerateMachine>>(
  undefined as any
)

function SimpleGenerateProvider(props: { children: ReactNode }) {
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
