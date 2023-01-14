/**
 * @credit https://github.com/egoist/typed-worker/blob/main/LICENSE
 * @description
 * A stripped down fork of typed-worker for communicating with workers only
 */
import mitt from "mitt"

const uuid = () => globalThis.crypto.randomUUID()

const WORKER_READY_MESSAGE_ID = "tworker:ready"

type ActionsType = Record<string, (payload: any) => any>

export function makeWorker<TActions extends ActionsType>(make: () => Worker) {
	type MitMsg<T = Awaited<ReturnType<typeof run>>, E = Error> =
		| { result: T; error?: never }
		| { result?: never; error: E }

	const ee = mitt<Record<string, MitMsg>>()

	let resolveReady: () => void

	let ready = new Promise<void>((resolve) => (resolveReady = resolve))

	let worker: Worker | undefined = make()

	function handleMessage(e: MessageEvent<{ id: string } & MitMsg>) {
		let data = e.data

		if (!data || typeof data !== "object") return

		if (data.id === WORKER_READY_MESSAGE_ID) {
			resolveReady()
			return
		}

		if (data.error) {
			ee.emit(data.id, { error: data.error })
		} else {
			ee.emit(data.id, { result: data.result })
		}
	}

	worker.addEventListener("message", handleMessage)

	async function run<
		TType extends keyof TActions,
		TAction extends TActions[TType],
	>(
		type: TType,
		/* TODO:  Handle functions that don't take args*/
		payload: Parameters<TAction>[0],
	): Promise<ReturnType<TAction>> {
		const id = uuid()
		await ready

		let result = new Promise<ReturnType<TAction>>((res, rej) => {
			ee.on(id, (m) => {
				ee.off(id)

				if (m.error) {
					rej(m.error)
				} else {
					res(m.result)
				}
			})
			let msg = { id, type, payload }
			worker?.postMessage(msg)
		})

		return result
	}

	function destroy() {
		worker?.terminate()
		worker = undefined
	}

	return { run, destroy }
}

export function handleActions(actions: ActionsType) {
	function sendToMain(message: any) {
		globalThis.postMessage(message)
	}

	// Notify the main thread that the worker is ready
	sendToMain({ id: WORKER_READY_MESSAGE_ID })

	/** Setup listener */
	onmessage = async (e: MessageEvent) => {
		const { id, type, payload } = e.data
		const action = actions[type]

		if (action) {
			try {
				const result = await action(payload)

				sendToMain({ id, result })
			} catch (error) {
				sendToMain({ id, error })
			}
		}
	}
}
