import KV from "../lib/kv"
import Spider from "../lib/spider"
import QueueManager from "../lib/queue"
import { CrawlQM, CrawledPages } from "../lib/types"

const Crawler = async (env: any, batch: CrawlQM[]) => {
	console.log('CRAWLER: msg received')
	const spider = new Spider()
	const kv = new KV(env.KV)
	const qm = new QueueManager(env.QUEUE_PARSER, env.QUEUE_INDEXER, env.QUEUE_CRAWLER)
	let crawledpages: CrawledPages
	try {
		crawledpages = await kv.getCrawledPages(batch[0].projectID)
	} catch {
		crawledpages = {
			projectID: batch[0].projectID,
			resources: new Set<string>()
		}
	}
	batch.forEach(async (msg) => {
		if (crawledpages.resources.has(msg.url)) {
			console.log('Resource EXISTS')
			return
		}
		const urls = await spider.Crawl(msg.url)
		urls.forEach(async (url) => {
			await qm.SendToParser({ projectID: msg.projectID, url: url })
			await qm.SendToCrawler({ projectID: msg.projectID, url: url })
		})
		crawledpages.resources.add(msg.url)
	})
	await kv.setCrawledPages(batch[0].projectID, crawledpages)
}

export default Crawler