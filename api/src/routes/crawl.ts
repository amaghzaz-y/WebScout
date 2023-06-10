import { Context } from 'hono'
import { z } from "zod";
import QueueManager from "../lib/queue";
import KV from '../lib/kv';


const crawlSchema = z.object(
	{
		projectID: z.string(),
		url: z.string()
	}
)

const crawlHandler = async (c: Context) => {
	const kv = new KV(c.env.KV)
	const body = {
		projectID: c.req.query('projectID'),
		url: c.req.query('url'),
	};
	let content: z.infer<typeof crawlSchema>
	try {
		content = crawlSchema.parse(body)
	} catch (e) {
		return new Response('Malformed Request', {
			status: 400,
			headers: {
				'Content-Type': 'text/plain',
			},
		})
	}
	
	let project = await kv.getProject(content.projectID)
	if (project == null) {
		return c.text("Project Not Found", 404)
	}
	
	const qm = new QueueManager(c.env.QUEUE_PARSER, c.env.QUEUE_INDEXER, c.env.QUEUE_CRAWLER);
	await qm.SendToCrawler({
		projectID: content.projectID,
		url: content.url
	})
	return c.text("SUCCESS: URL queued for crawling.")
}

export default crawlHandler