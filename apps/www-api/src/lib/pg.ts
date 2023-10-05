import { type MiddlewareHandler } from "hono"
import { getDB } from "~/db"

export interface Variables {
	pg: ReturnType<typeof getDB>
}

/**
 * @description Adds `sql` to context.
 * Adding this has at the global * route has minimal overhead.
 * The cost of connecting to the DB is incurred when `await`ing some `sql`
 */
export function makePgMiddleware(
	opts: Parameters<typeof getDB>[0],
): MiddlewareHandler {
	return async (ctx, next) => {
		let db = getDB(opts)
		ctx.set("pg", db)
		await next()

		// Cleanup
		await db.destroy()

		if (ctx.error) {
			console.error(ctx.error)
		}
	}
}
