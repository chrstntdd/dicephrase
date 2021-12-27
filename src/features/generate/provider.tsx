import type { ActorRefFrom } from "xstate"
import { createContext, createMemo, useContext } from "solid-js"

import { useMachine } from "../../lib/solid-xstate/use-machine"

import { generateMachine } from "./generate.machine"

const GenCtx = createContext<ActorRefFrom<typeof generateMachine>>(
  undefined as any
)

function GenerateProvider(props: { children: ReactNode }) {
  let m = useMachine(generateMachine, { devTools: true })

  let actor = createMemo(() => m[2])

  return <GenCtx.Provider value={actor()}>{props.children}</GenCtx.Provider>
}

function useGenerate() {
  return useContext(GenCtx)
}

export { GenerateProvider, useGenerate }
