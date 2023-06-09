import { Context } from "hono"
import KV from "../lib/kv"
import Spider from "../lib/spider"
import QueueManager from "../lib/queue"

const Parser = async (c: Context, projectID: string, url: string) => {
	const spider = new Spider()
	const kv = new KV(c.env.KV)
	const qm = new QueueManager(c.env.QUEUE_PARSER, c.env.QUEUE_INDEXER, c.env.QUEUE_CRAWLER)
	const parsedpage = await kv.getParsedPage(projectID)
	if (parsedpage.resources.has(url)) {
		return
	}
	const page = await spider.Parse(url)
	await kv.setPage(projectID, page)
	await qm.SendToIndexer({ projectID: projectID, pageID: page.pageID })
}

export default Parser