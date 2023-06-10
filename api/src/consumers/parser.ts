import KV from "../lib/kv"
import Spider from "../lib/spider"
import QueueManager from "../lib/queue"
import { ParseQM } from "../lib/types"


const Parser = async (env: any, batch: ParseQM[]) => {
	console.log('PARSER: msg received')
	const spider = new Spider()
	const kv = new KV(env.KV)
	const qm = new QueueManager(env.QUEUE_PARSER, env.QUEUE_INDEXER, env.QUEUE_CRAWLER)
	let parsedpages = await kv.getParsedPages(batch[0].projectID)
	if (parsedpages === null) {
		parsedpages = {
			projectID: batch[0].projectID,
			resources: []
		}
	}
	for (const msg of batch) {
		console.log(JSON.stringify(parsedpages))
		if (parsedpages?.resources.includes(msg.url)) {
			console.log('Resource EXISTS')
			return
		}
		console.log(JSON.stringify(msg))
		const page = await spider.Parse(msg.url)
		console.log('sending')
		await kv.setPage(msg.projectID, page)
		await qm.SendToIndexer({ projectID: msg.projectID, pageID: page.pageID })
	}
	await kv.setParsedPages(batch[0].projectID, parsedpages)
}
export default Parser