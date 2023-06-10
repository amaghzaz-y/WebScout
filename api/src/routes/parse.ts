import { Context } from 'hono'
import { z } from "zod";
import QueueManager from "../lib/queue";
import Spider from '../lib/spider';
import KV from '../lib/kv';


const parseSchema = z.object(
	{
		projectID: z.string(),
		url: z.string()
	}
)

const parseHandler = async (c: Context) => {
	const kv = new KV(c.env.KV)

	const body = {
		projectID: c.req.query('projectID'),
		url: c.req.query('url'),
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
	const spider = new Spider()
	let page = await spider.Parse(content.url)
	if (page == null) {
		return c.text(`Error: ${content.url} cannot be parsed`)
	}
	await kv.setPage(content.projectID, page)
	const qm = new QueueManager(c.env.QUEUE_PARSER, c.env.QUEUE_INDEXER, c.env.QUEUE_CRAWLER);
	await qm.SendToIndexer({
		projectID: content.projectID,
		pageID: page.pageID
	})
	return c.text("SUCCESS: URL Parsed")
}

export default parseHandler