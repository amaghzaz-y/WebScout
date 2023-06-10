import { WebScoutEngine } from "webscout"
import { Context } from 'hono'
import { z } from "zod";
import KV from "../lib/kv"

const searchSchema = z.object(
	{
		projectID: z.string(),
		query: z.string(),
		limit: z.string().optional()
	}
)

const searchHandler = async (c: Context) => {
	const kv = new KV(c.env.KV)
	const body = {
		projectID: c.req.query('projectID'),
		query: c.req.query('query'),
		limit: c.req.query('limit')
	};
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
	const project = await kv.getProject(content.projectID)
	const tokenizer = await kv.getTokenizer(project.language);
	const index = await kv.getIndex(content.projectID, 0);

	if (index == undefined) {
		c.status(200);
		return c.text("error: index not found");
	}

	const ws = new WebScoutEngine(index, tokenizer)
	// return Object
	let results = ws.Search(content.query)
	return c.json(results)
}

export default searchHandler