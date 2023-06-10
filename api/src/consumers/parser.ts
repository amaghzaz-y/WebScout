import KV from "../lib/kv"
import Spider from "../lib/spider"
import QueueManager from "../lib/queue"
import { ParseQM } from "../lib/types"


const Parser = async (env: any, batch: ParseQM[]) => {
	console.log('PARSER::Consumer')
	const spider = new Spider()
	const kv = new KV(env.KV)
	const qm = new QueueManager(env.QUEUE_PARSER, env.QUEUE_INDEXER, env.QUEUE_CRAWLER)
	let parsedpages = await kv.getParsedPages(batch[0].projectID)
	if (parsedpages == null) {
		parsedpages = {
			projectID: batch[0].projectID,
			resources: []
		}
	}
	for (const msg of batch) {
		console.log(JSON.stringify(parsedpages))
		if (parsedpages?.resources.includes(msg.url)) {
			console.log('PARSER::Resource::Exists')
			return
		}
		const page = await spider.Parse(msg.url)
		if (page == null) {
			throw new Error("PARSER::Error::Parsing")
		}
		await kv.setPage(msg.projectID, page)
		parsedpages.resources.push(msg.url);
		await qm.SendToIndexer({ projectID: msg.projectID, pageID: page.pageID })
	}
	await kv.setParsedPages(batch[0].projectID, parsedpages)
	console.log("PARSER::Saved::ParsedPages")
}
export default Parser