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
import crawlHandler from './routes/crawl'
import parseHandler from './routes/parse'
// instantiate wasm
InitEngine()

const app = new Hono()

app.use("/*", cors())

app.get('/', async (c) => { return c.text("ws-api says hello 👋!") })

app.get('/search', searchHandler)
app.get('/crawl', crawlHandler)
app.get('/parse', parseHandler)
app.get('/new/project');
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

			// that's very ugly, will refactor later
			case 'ws-index':

				break

			default:
				console.log('ERROR: no queue detected')
		}

	},
}

