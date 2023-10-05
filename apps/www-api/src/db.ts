import { Pool, type PoolConfig } from "pg"
import {
	Kysely,
	PostgresDialect,
	type Generated,
	type Selectable,
} from "kysely"

interface Counters {
	id: Generated<number>
	name: string
	value: Generated<number>
	version: Generated<number>
}

export type User = Selectable<Counters>

type PgOpts = { poolConfig: PoolConfig }

interface Database {
	counters: Counters
}

export function getDB(opts: PgOpts) {
	const dialect = new PostgresDialect({
		pool: new Pool(opts.poolConfig),
	})
	return new Kysely<Database>({
		dialect,
	})
}
