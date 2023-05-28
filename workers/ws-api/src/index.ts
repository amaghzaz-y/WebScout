import { Context, Hono } from 'hono'
import WebScoutEngine from "webscout"
import { getIndex, getTokenizer } from "database"
import { z } from "zod";

const searchSchema = z.object(
	{
		clientID: z.string(),
		projectID: z.string(),
		query: z.string(),
		limit: z.number()
	}
)

const indexSchema = z.object(
	{
		clientID: z.string(),
		projectID: z.string(),
		title: z.string(),
		content: z.string(),
		language: z.string().max(2)
	}
)

const app = new Hono()



const searchHandler = async (c: Context) => {
	const body = await c.req.json();
	let content: z.infer<typeof searchSchema>
	try {
		content = searchSchema.parse(body)
	} catch {
		return c.text("error parsing request")
	}
	const tokenizer = await getTokenizer(body.language);
	const index = await getIndex(body.clientID, body.projectID);
	
	if (index == undefined) {
		c.status(502);
		return c.text("error: index not found");
	}
	
	const ws = new WebScoutEngine(index, tokenizer, body.language)
	let results: string
	if (body.type == 'all') {
		results = ws.SearchAll(body.query)
	}
	else {
		results = ws.Search(body.query)
	}
	return c.json(JSON.parse(results))
}

app.post('/search', searchHandler)

export default app


