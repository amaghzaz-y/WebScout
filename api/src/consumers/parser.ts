import { Context } from "hono"
import KV from "../lib/kv"
import Spider from "../lib/spider"
import QueueManager from "../lib/queue"

const Parser = async (c: Context, projectID: string, url: string) => {
	const spider = new Spider()
	const kv = new KV(c.env.KV)
	const qm = new QueueManager(c.env.QUEUE_PARSER, c.env.QUEUE_INDEXER, c.env.QUEUE_CRAWLER)
	const crawledurl = await kv.getCrawledURL(projectID)
	if (crawledurl.resources.has(url)) {
		return
	}
	const urls = await spider.Crawl(url)
	urls.forEach(async (url) => {
		await qm.SendToParser({ projectID: projectID, url: url })
	})
	crawledurl.resources.add(url)
	await kv.setCrawledURL(projectID, crawledurl)
}

export default Parser