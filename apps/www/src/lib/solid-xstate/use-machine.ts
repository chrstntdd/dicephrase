import { onCleanup, batch } from "solid-js"
import { createStore, reconcile, SetStoreFunction } from "solid-js/store"
import type {
	AnyStateMachine,
	AreAllImplementationsAssumedToBeProvided,
	InternalMachineOptions,
	InterpreterFrom,
	InterpreterOptions,
	Prop,
	StateFrom,
} from "xstate"

import { createService } from "./create-service"
import type { UseMachineOptions } from "./types"

/**
 * A fork of https://github.com/statelyai/xstate/pull/2932/files#diff-6223065f3a0c922de1cdb999cd558df10e4c94bdcd0c68aed3ef1210a3a93d30
 * until it gets merged
 */

/* eslint-disable */

function updateState<NextState extends object>(
	nextState: NextState,
	setState: SetStoreFunction<NextState>,
	merge = true,
): void {
	if (typeof nextState === "object" && !!nextState) {
		setState(reconcile<NextState, unknown>(nextState, { merge }))
	} else {
		setState(nextState)
	}
}

type RestParams<TMachine extends AnyStateMachine> =
	AreAllImplementationsAssumedToBeProvided<
		TMachine["__TResolvedTypesMeta"]
	> extends false
		? [
				options: InterpreterOptions &
					UseMachineOptions<TMachine["__TContext"], TMachine["__TEvent"]> &
					InternalMachineOptions<
						TMachine["__TContext"],
						TMachine["__TEvent"],
						TMachine["__TResolvedTypesMeta"],
						true
					>,
		  ]
		: [
				options?: InterpreterOptions &
					UseMachineOptions<TMachine["__TContext"], TMachine["__TEvent"]> &
					InternalMachineOptions<
						TMachine["__TContext"],
						TMachine["__TEvent"],
						TMachine["__TResolvedTypesMeta"]
					>,
		  ]

export type UseMachineReturn<
	TMachine extends AnyStateMachine,
	TInterpreter = InterpreterFrom<TMachine>,
> = [StateFrom<TMachine>, Prop<TInterpreter, "send">, TInterpreter]

export function useMachine<TMachine extends AnyStateMachine>(
	machine: TMachine,
	...[options = {}]: RestParams<TMachine>
): UseMachineReturn<TMachine> {
	const service = createService(machine, options)

	const [state, setState] = createStore<StateFrom<TMachine>>({
		...service.state,
		toJSON() {
			return service.state.toJSON()
		},
		toStrings(...args: Parameters<StateFrom<TMachine>["toStrings"]>) {
			return service.state.toStrings(args[0], args[1])
		},
		can(...args: Parameters<StateFrom<TMachine>["can"]>) {
			state.value // sets state.value to be tracked
			return service.state.can(args[0])
		},
		hasTag(...args: Parameters<StateFrom<TMachine>["hasTag"]>) {
			state.tags // sets state.tags to be tracked
			return service.state.hasTag(args[0])
		},
		matches(...args: Parameters<StateFrom<TMachine>["matches"]>) {
			state.value // sets state.value to be tracked
			return service.state.matches(args[0] as never)
		},
	} as StateFrom<TMachine>)

	const { unsubscribe } = service.subscribe((nextState) => {
		batch(() => {
			updateState(
				nextState,
				setState as SetStoreFunction<StateFrom<AnyStateMachine>>,
			)
		})
	})

	onCleanup(unsubscribe)

	return [
		// States are readonly by default, make downstream typing easier by casting away from DeepReadonly wrapper
		state as unknown as StateFrom<TMachine>,
		service.send,
		service,
	] as UseMachineReturn<TMachine>
}
