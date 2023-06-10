import KV from "../lib/kv"
import { WebScoutEngine } from "webscout"
import { IndexQM } from "../lib/types"

const Indexer = async (env: any, batch: IndexQM[]) => {
	console.log('INDEXER: msg received')
	const kv = new KV(env.KV)
	const project = await kv.getProject(batch[0].projectID)
	const tokenizer = await kv.getTokenizer(project.language)
	const index = await kv.getIndex(project.projectID, 0)
	let WS = new WebScoutEngine(index, tokenizer)
	batch.forEach(async (msg) => {
		console.log(`IN LOOP`)
		console.log(JSON.stringify(msg))
		const page = await kv.getPage(msg.projectID, msg.pageID)
		if (page === null) {
			console.log(`page empty`)
			return
		}
		console.log(`GOT PAGE`)
		console.log(JSON.stringify(page))
		WS.Index(page.title as string, page.content)
		console.log(`INDEXED ${page.title} SUCCESSFULLY`)
	})
	const idx = WS.ExportIndex() as Uint8Array
	await kv.setIndex(project.projectID, 0, idx);
	console.log("SAVED INDEX SUCCESSFULLY")
}

export default Indexer