import KV from "../lib/kv"
import { WebScoutEngine } from "webscout"
import { IndexQM } from "../lib/types"

const Indexer = async (env: any, batch: IndexQM[]) => {
	const kv = new KV(env.KV)
	const project = await kv.getProject(batch[0].projectID)
	if (project == null) {
		throw new Error("INDEXER : Project Not Found")
	}
	const tokenizer = await kv.getTokenizer(project.language)
	const index = await kv.getIndex(project.projectID, 0)
	let WS = new WebScoutEngine(index, tokenizer)
	for (const msg of batch) {
		console.log(JSON.stringify(msg))
		const page = await kv.getPage(msg.projectID, msg.pageID)
		if (page == null) {
			throw new Error("INDEXER : Page Not Found")
		}
		WS.Index(page.title as string, page.content)
	}
	const idx = WS.ExportIndex() as Uint8Array
	await kv.setIndex(project.projectID, 0, idx);
}

export default Indexer