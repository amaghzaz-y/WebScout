import { HTTPException } from 'hono/http-exception'
import { Context } from 'hono'
import { z } from "zod";
import KV from "../lib/kv"
import QueueManager from "../lib/queue";
import { nanoid } from "nanoid";
import { Page } from "../lib/types";

const indexSchema = z.object(
	{
		projectID: z.string().min(4),
		title: z.string(),
		body: z.string(),
	}
)

const indexHandler = async (c: Context) => {
	const kv = new KV(c.env.KV)
	const obj = await c.req.json();
	let body: z.infer<typeof indexSchema>
	try {
		body = indexSchema.parse(obj)
	} catch {
		throw new HTTPException(400, { message: 'Malformed Request' })
	}
	const qm = new QueueManager(c.env.QUEUE_PARSER, c.env.QUEUE_INDEXER, c.env.QUEUE_CRAWLER);
	let page: Page = {
		pageID: nanoid(),
		title: body.title,
		content: body.body
	}
	await kv.setPage(body.projectID, page)
	await qm.SendToIndexer({
		projectID: body.projectID,
		pageID: page.pageID,
	})
	return c.text("SUCCESS: Request queued for indexing.")
}

export default indexHandler