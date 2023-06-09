import { Context } from "hono"
import KV from "../lib/kv"
import Spider from "../lib/spider"
const crawler = async (c: Context, url: string, projectID: string) => {
	const spider = new Spider()
	const kv = new KV(c.env.KV)
	const crawledurl = await kv.getCrawledURL(projectID)
	if (crawledurl.resources.has(url)) {
		return
	}
	const urls = await spider.Crawl(url)
	urls.forEach((url)=>{
		
	})
}