import { createSignal, onCleanup } from "solid-js"
import type { Accessor } from "solid-js"
import type { ActorRef } from "xstate"

/* eslint-disable @typescript-eslint/no-explicit-any */

type EmittedFromActorRef<TActor extends ActorRef<any, any>> =
	TActor extends ActorRef<any, infer TEmitted> ? TEmitted : never

export function useActor<TActor extends ActorRef<any, any>>(
	actor: TActor,
): [state: Accessor<EmittedFromActorRef<TActor>>, send: TActor["send"]] {
	let [state, setState] = createSignal(actor.getSnapshot().state)
	let { unsubscribe } = actor.subscribe((s) => {
		if (s.changed) {
			setState(s)
		}
	})

	onCleanup(() => unsubscribe())

	return [state, actor.send]
}
