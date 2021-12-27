import { createContext, useContext } from "react"
import type { ReactNode } from "react"
import { useMachine } from "@xstate/react"

import { generateMachine } from "./generate.machine"
import type { ActorRefFrom } from "xstate"

const GenCtx = createContext<ActorRefFrom<typeof generateMachine>>(
  undefined as any
)

function GenerateProvider(props: { children: ReactNode }) {
  let actor = useMachine(generateMachine, { devTools: true })[2]

  return <GenCtx.Provider value={actor}>{props.children}</GenCtx.Provider>
}

function useGenerate() {
  return useContext(GenCtx)
}

export { GenerateProvider, useGenerate }
