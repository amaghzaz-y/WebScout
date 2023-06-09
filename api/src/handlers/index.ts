import { WebScoutEngine } from "webscout"
import { HTTPException } from 'hono/http-exception'
import { Context } from 'hono'
import { z } from "zod";
import KV from "../kv"

const indexSchema = z.object(
	{
		projectID: z.string(),
		language: z.string().max(2),
		title: z.string(),
		body: z.string(),
	}
)

const indexHandler = async (c: Context) => {
	const kv = new KV(c.env.KV)
	const body = await c.req.json();
	let content: z.infer<typeof indexSchema>
	try {
		content = indexSchema.parse(body)
	} catch {
		throw new HTTPException(400, { message: 'Malformed Request' })
	}
	const tokenizer = await kv.getTokenizer(content.language);
	const index = await kv.getIndex(content.projectID, 0) as Uint8Array | null;
	const ws = new WebScoutEngine(index, tokenizer, content.language)
	ws.Index(content.title, content.body)
	const idx = ws.ExportIndex()
	if (idx !== null && idx !== undefined) {
		await kv.setIndex(content.projectID, 0, idx)
		return c.text('indexed successfully')
	}
	c.status(502)
	return c.text('error indexing file!')
}

export default indexHandler