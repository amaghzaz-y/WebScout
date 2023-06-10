import { Context } from "hono"
import KV from "../lib/kv"
import { WebScoutEngine } from "webscout"
import { Page } from "../lib/types"

const Indexer = async (c: Context, projectID: string, pageIDList: string[]) => {
	const kv = new KV(c.env.KV)
	const project = await kv.getProject(projectID)
	const tokenizer = await kv.getTokenizer(project.language)
	const index = await kv.getIndex(project.projectID, 0)
	let WS = new WebScoutEngine(index, tokenizer, project.language)
	pageIDList.forEach(async (pageID) => {
		const page = await kv.getPage(projectID, pageID) as Page
		WS.Index(page.title as string, page.content)
	})
	const idx = WS.ExportIndex() as Uint8Array
	await kv.setIndex(project.projectID, 0, idx);
	console.log('indexed successfully')
}

export default Indexer