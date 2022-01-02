import { Accessor, createSignal, onCleanup } from "solid-js"
import type { ActorRef, EventObject, Sender } from "xstate"

type EmittedFromActorRef<TActor extends ActorRef<any, any>> =
  TActor extends ActorRef<any, infer TEmitted> ? TEmitted : never

export function useActor<TActor extends ActorRef<any, any>>(
  actorRef: TActor
): [state: Accessor<EmittedFromActorRef<TActor>>, send: TActor["send"]]

export function useActor<TEvent extends EventObject, TEmitted>(
  actorRef: ActorRef<TEvent, TEmitted>
): [state: Accessor<TEmitted>, send: Sender<TEvent>]

export function useActor(
  actor: ActorRef<EventObject, unknown>
): [state: Accessor<unknown>, send: Sender<EventObject>] {
  // @ts-ignore
  let [state, setState] = createSignal(actor.getSnapshot().state)
  let { unsubscribe } = actor.subscribe((s) => {
    // @ts-ignore
    if (s.changed) {
      setState(s)
    }
  })

  onCleanup(() => unsubscribe())

  return [state, actor.send]
}
