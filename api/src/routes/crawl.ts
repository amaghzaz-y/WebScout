import { Context } from 'hono'
import { z } from "zod";
import QueueManager from "../lib/queue";


const crawlSchema = z.object(
	{
		projectID: z.string(),
		url: z.string()
	}
)

const crawlHandler = async (c: Context) => {
	const body = {
		projectID: c.req.query('projectID'),
		url: c.req.query('projectID'),
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
	const qm = new QueueManager(c.env.QUEUE_PARSER, c.env.QUEUE_INDEXER, c.env.QUEUE_CRAWLER);
	await qm.SendToParser({
		projectID: content.projectID,
		url: content.url
	})
	c.text("SUCCESS: URL queued for crawling.")
}

export default crawlHandler