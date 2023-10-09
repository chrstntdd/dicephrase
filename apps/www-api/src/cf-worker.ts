import { Hono } from "hono"
import { makePgMiddleware } from "./lib/pg"

let app = new Hono()

app.use(
	"*",
	makePgMiddleware({
		poolConfig: {
			database: "postgres",
			user: "postgres",
			password: "postgres",
			host: "0.0.0.0",
			port: 5434,
			max: 10,
		},
	}),
)

app.patch("/dicephrase/hits", async (ctx) => {
	return ctx.text("boo", 400)
})

export default app
