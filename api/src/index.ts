import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { InitEngine, WebScoutEngine } from "webscout"
import searchHandler from './routes/search'
import indexHandler from './routes'
import Crawler from './consumers/crawler'
import { CrawlQM, IndexQM, ParseQM } from './lib/types'
import Parser from './consumers/parser'
import Indexer from './consumers/indexer'
import KV from './lib/kv'
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
		batch: MessageBatch,
		env: any,
		ctx: ExecutionContext
	): Promise<void> {
		switch (batch.queue) {

			case 'ws-crawl':
				batch.messages.forEach(async (msg) => {
					let body = msg.body as CrawlQM
					await Crawler(env, body.projectID, body.url)
					msg.ack()
				})
				break

			case 'ws-parse':
				batch.messages.forEach(async (msg) => {
					let body = msg.body as ParseQM
					await Parser(env, body.projectID, body.url)
					msg.ack()
				})
				break

			case 'ws-index':
				const kv = new KV(env.KV)
				let lang = ''
				let projectID = ''
				let tokenizer: Uint8Array
				let index: Uint8Array | null
				let WS: WebScoutEngine | any
				batch.messages.forEach(async (msg) => {
					let body = msg.body as IndexQM
					// assign new language pack
					if (lang !== body.language) {
						lang = body.language
						tokenizer = await kv.getTokenizer(lang)
						WS = new WebScoutEngine(index, tokenizer, body.language)
					}
					// change the index
					if (projectID !== body.projectID) {
						// to avoid saving index if projectID is undefined
						if (projectID.length > 0) {
							let newIndex = WS.ExportIndex()
							await kv.setIndex(projectID, 0, newIndex)
						}
						projectID = body.projectID
						index = await kv.getIndex(projectID, 0)
						WS = new WebScoutEngine(index, tokenizer, body.language)
					}
					await Indexer(env, WS, body.projectID, body.pageID)
					msg.ack()
				})
				let newIndex = WS.ExportIndex()
				await kv.setIndex(projectID, 0, newIndex)
				break

			default:
				console.log('ERROR: no queue detected')
		}

	},
}

