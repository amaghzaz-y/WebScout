import KV from "../lib/kv"
import { WebScoutEngine } from "webscout"
import { IndexQM } from "../lib/types"

const Indexer = async (env: any, batch: IndexQM[]) => {
	console.log("INDEXER::Consumer")
	const kv = new KV(env.KV)
	const project = await kv.getProject(batch[0].projectID)
	if (project == null) {
		console.log(`"INDEXER : ${batch[0].projectID} Not Found"`)
		return
	}
	const tokenizer = await kv.getTokenizer(project.language)
	const index = await kv.getIndex(project.projectID, 0)
	let WS = new WebScoutEngine(index, tokenizer)
	for (const msg of batch) {
		const page = await kv.getPage(msg.projectID, msg.pageID)
		if (page == null) {
			console.log(`INDEXER::Error::PageNotFound::${msg.pageID}`)
			return
		}
		WS.Index(page.title, page.content)
	}
	const idx = WS.ExportIndex() as Uint8Array
	await kv.setIndex(project.projectID, 0, idx);
}

export default Indexer