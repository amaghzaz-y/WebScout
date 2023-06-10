import { Context } from "hono"
import KV from "../lib/kv"
import Spider from "../lib/spider"
import QueueManager from "../lib/queue"
const Parser = async (env: any, projectID: string, url: string) => {
	const spider = new Spider()
	const kv = new KV(env.KV)
	const qm = new QueueManager(env.QUEUE_PARSER, env.QUEUE_INDEXER, env.QUEUE_CRAWLER)
	const parsedpage = await kv.getParsedPage(projectID)
	if (parsedpage.resources.has(url)) {
		return
	}
	const page = await spider.Parse(url)
	await kv.setPage(projectID, page)
	await qm.SendToIndexer({ projectID: projectID, pageID: page.pageID, language: page.language })
}

export default Parser