import { Context, Hono } from 'hono'
import { WebScoutEngine, InitEngine } from "webscout"
import { KV, DB } from "database"
import { z } from "zod";

InitEngine()

const searchSchema = z.object(
	{
		userID: z.string(),
		projectID: z.string().max(2),
		language: z.string(),
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
		content: z.string(),
	}
)

const app = new Hono()

const searcherHandler = async (c: Context) => {
	const kv = new KV()
	const body = await c.req.json();
	let content: z.infer<typeof searchSchema>
	try {
		content = searchSchema.parse(body)
	} catch {
		return c.text("error parsing request")
	}
	const tokenizer = await kv.getTokenizer(content.language);
	const index = await kv.getIndex(content.userID, content.projectID, 0);

	if (index == undefined) {
		c.status(502);
		return c.text("error: index not found");
	}

	const ws = new WebScoutEngine(index, tokenizer, content.language)
	// return Object
	let results = ws.Search(content.query)
	return c.json(results)
}

const indexerHandler = async (c: Context) => {
	const kv = new KV()
	const body = await c.req.json();
	let content: z.infer<typeof indexSchema>
	try {
		content = indexSchema.parse(body)
	} catch {
		return c.text("error parsing request")
	}
	const tokenizer = await kv.getTokenizer(content.language);
	const index = await kv.getIndex(content.userID, content.projectID, 0) as Uint8Array | null;
	const ws = new WebScoutEngine(index, tokenizer, content.language)
}

app.post('/search', searcherHandler)
app.post('/index', indexerHandler)


export default app


