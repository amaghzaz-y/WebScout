import { Context } from 'hono'
import { z } from "zod";
import QueueManager from "../lib/queue";


const parseSchema = z.object(
	{
		projectID: z.string(),
		url: z.string()
	}
)

const parseHandler = async (c: Context) => {
	const body = {
		projectID: c.req.query('projectID'),
		url: c.req.query('projectID'),
	};
	let content: z.infer<typeof parseSchema>
	try {
		content = parseSchema.parse(body)
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
	return c.text("SUCCESS: URL queued for parsing.")
}

export default parseHandler