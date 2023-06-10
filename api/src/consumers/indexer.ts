import KV from "../lib/kv"
import { WebScoutEngine } from "webscout"
import { IndexQM, Page } from "../lib/types"

const Indexer = async (env: any, batch: IndexQM[]) => {
	const kv = new KV(env.KV)
	const project = await kv.getProject(batch[0].projectID)
	const tokenizer = await kv.getTokenizer(project.language)
	const index = await kv.getIndex(project.projectID, 0)
	let WS = new WebScoutEngine(index, tokenizer)
	batch.forEach(async (msg) => {
		const page = await kv.getPage(msg.projectID, msg.pageID) as Page
		WS.Index(page.title as string, page.content)
	})
	const idx = WS.ExportIndex() as Uint8Array
	await kv.setIndex(project.projectID, 0, idx);
	console.log('indexed successfully')
}

export default Indexer