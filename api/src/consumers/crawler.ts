import KV from "../lib/kv"
import Spider from "../lib/spider"
import QueueManager from "../lib/queue"

const Crawler = async (env: any, projectID: string, url: string) => {
	const spider = new Spider()
	const kv = new KV(env.KV)
	const qm = new QueueManager(env.QUEUE_PARSER, env.QUEUE_INDEXER, env.QUEUE_CRAWLER)
	const crawledurl = await kv.getCrawledURL(projectID)
	if (crawledurl.resources.has(url)) {
		return
	}
	const urls = await spider.Crawl(url)
	urls.forEach(async (url) => {
		await qm.SendToParser({ projectID: projectID, url: url })
		await qm.SendToCrawler({ projectID: projectID, url: url })
	})
	crawledurl.resources.add(url)
	await kv.setCrawledURL(projectID, crawledurl)
}

export default Crawler