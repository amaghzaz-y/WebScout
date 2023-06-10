import KV from "../lib/kv"
import Spider from "../lib/spider"
import QueueManager from "../lib/queue"
import { CrawlQM } from "../lib/types"

const Crawler = async (env: any, batch: CrawlQM[]) => {
	console.log("CRAWLER::Consumer")
	const spider = new Spider()
	const kv = new KV(env.KV)
	const qm = new QueueManager(env.QUEUE_PARSER, env.QUEUE_INDEXER, env.QUEUE_CRAWLER)
	let crawledpages = await kv.getCrawledPages(batch[0].projectID)
	if (crawledpages == null) {
		crawledpages = {
			projectID: batch[0].projectID,
			resources: []
		}
	}
	for (const msg of batch) {
		if (crawledpages.resources.includes(msg.url)) {
			console.log('Resource EXISTS')
			return
		}
		const urls = await spider.Crawl(msg.url)
		console.log(`CRAWLER::Found::${urls.size}`)
		for (const url of urls) {
			await qm.SendToParser({ projectID: msg.projectID, url: url })
			await qm.SendToCrawler({ projectID: msg.projectID, url: url })
		}
		crawledpages.resources.push(msg.url)
	}
	await kv.setCrawledPages(batch[0].projectID, crawledpages)
}

export default Crawler