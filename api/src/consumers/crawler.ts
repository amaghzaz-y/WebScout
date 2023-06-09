import { Context } from "hono"
import KV from "../lib/kv"
import Spider from "../lib/spider"
import QueueManager from "../lib/queue"

const Crawler = async (c: Context, url: string, projectID: string) => {
	const spider = new Spider()
	const kv = new KV(c.env.KV)
	const qm = new QueueManager(c.env.QUEUE_PARSER, c.env.QUEUE_INDEXER)
	const crawledurl = await kv.getCrawledURL(projectID)
	if (crawledurl.resources.has(url)) {
		return
	}
	const urls = await spider.Crawl(url)
	urls.forEach((url) => {
		qm.SendToParser({ projectID: projectID, url: url })
	})
}

export default Crawler