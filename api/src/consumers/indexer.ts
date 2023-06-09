import { Context } from "hono"
import KV from "../lib/kv"
import { WebScoutEngine } from "webscout"
import { Page } from "../lib/types"

const Indexer = async (c: Context, WS: WebScoutEngine, projectID: string, pageID: string) => {
	const kv = new KV(c.env.KV)
	const page = await kv.getPage(projectID, pageID) as Page
	WS.Index(page.title as string, page.content)
}

export default Indexer