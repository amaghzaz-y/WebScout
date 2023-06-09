import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { InitEngine } from "webscout"
import searchHandler from './routes/search'
import indexHandler from './routes'

// instantiate wasm
InitEngine()

const app = new Hono()

app.use("/*", cors())

app.get('/', async (c) => { return c.text("ws-api says hello !") })

app.get('/q', async (c: Context) => {
	await c.env.QUEUE.send({
		msg: 'hello from queue'
	}) as any
	return c.text("added to queue")
})

app.post('/search', searchHandler)
app.post('/index', indexHandler)


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return app.fetch(request, env, ctx)
	},
	async queue(
		msg: MessageBatch,
		env: any,
		ctx: ExecutionContext
	): Promise<void> {
		msg.messages
		console.log(JSON.stringify(msg))
	},
}

