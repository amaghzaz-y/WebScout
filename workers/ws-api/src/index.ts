import { Context, Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { cors } from 'hono/cors'
import { WebScoutEngine, InitEngine } from "webscout"
import { KV } from "database"
import { z } from "zod";

// instantiate wasm
InitEngine()

const searchSchema = z.object(
	{
		userID: z.string(),
		projectID: z.string(),
		language: z.string().max(2),
		query: z.string(),
		limit: z.number()
	}
)

const indexSchema = z.object(
	{
		userID: z.string(),
		projectID: z.string(),
		language: z.string().max(2),
		title: z.string(),
		body: z.string(),
	}
)

const app = new Hono()
app.use("/*", cors())

app.get('/', async (c) => { return c.text("ws-api says hello !") })

app.get('/migrate', async (c) => {

})

app.post('/search', async (c: Context) => {
	const kv = new KV(c.env.WSKV)
	const body = await c.req.json();
	let content: z.infer<typeof searchSchema>
	try {
		content = searchSchema.parse(body)
	} catch (e) {
		return new Response('Malformed Request', {
			status: 400,
			headers: {
				'Content-Type': 'text/plain',
			},
		})
	}
	const tokenizer = await kv.getTokenizer(content.language);
	const index = await kv.getIndex(content.userID, content.projectID, 0);

	if (index == undefined) {
		c.status(200);
		return c.text("error: index not found");
	}

	const ws = new WebScoutEngine(index, tokenizer, content.language)
	// return Object
	let results = ws.Search(content.query)
	return c.json(results)
})


app.post('/index', async (c: Context) => {
	const kv = new KV(c.env.WSKV)
	const body = await c.req.json();
	let content: z.infer<typeof indexSchema>
	try {
		content = indexSchema.parse(body)
	} catch {
		throw new HTTPException(400, { message: 'Malformed Request' })
	}
	const tokenizer = await kv.getTokenizer(content.language);
	const index = await kv.getIndex(content.userID, content.projectID, 0) as Uint8Array | null;
	const ws = new WebScoutEngine(index, tokenizer, content.language)
	ws.Index(content.title, content.body)
	const idx = ws.ExportIndex()
	if (idx !== null && idx !== undefined) {
		await kv.setIndex(content.userID, content.projectID, 0, idx)
		return c.text('indexed successfully')
	}
	c.status(502)
	return c.text('error indexing file!')
})


export default app


