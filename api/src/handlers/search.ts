import { WebScoutEngine } from "../../../core/ts/webscout"
import { Context } from 'hono'
import { z } from "zod";
import KV from "../kv"

const searchSchema = z.object(
	{
		projectID: z.string(),
		language: z.string().max(2),
		query: z.string(),
		limit: z.number()
	}
)

const searchHandler = async () => {
	async (c: Context) => {
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
		const index = await kv.getIndex(content.projectID, 0);

		if (index == undefined) {
			c.status(200);
			return c.text("error: index not found");
		}

		const ws = new WebScoutEngine(index, tokenizer, content.language)
		// return Object
		let results = ws.Search(content.query)
		return c.json(results)
	}
}

export default searchHandler