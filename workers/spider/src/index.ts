import { Context, Hono } from 'hono'
import * as cheerio from 'cheerio';
import parseURL from 'parse-url'
const app = new Hono()



app.get('/', (c) => c.text('hello from ws-spider'))

app.get('/scrape', async (c: Context) => {
	const url = c.req.query('url')
	const res = await fetch(url as string)
	const body = await res.text()
	let $ = cheerio.load(body)
	let lang = $('html').attr('lang')
	let title = $('title').text()
	$('script').remove()
	let content = $('body').text().split('\n')
	let text: string = 'text'
	content.forEach(e => {
		text = text.concat(` ${e.trim()}`)
	})
	const data = {
		title: title.trim(),
		language: lang,
		body: text
	}
	return c.json(data)
})

app.get('/map', async (c: Context) => {
	const url = c.req.query('url') as string
	const res = await fetch(`{url}/sitemap.xml`)
	const hostname = parseURL(url).resource
	const body = await res.text()
	const regex = /(?:https?|ftp):\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:% _\+.~#?&//=]*)/g;
	const matches = body.match(regex);
	let urls: Array<string> = [url as string]
	matches?.forEach((e) => {
		let hn = parseURL(e).resource
		if (hn == hostname) {
			urls.push(e)
		}
	})
	return c.text(String(urls))
})

export default {
	fetch(request: Request, env: any, ctx: ExecutionContext) {
		return app.fetch(request, env, ctx)
	}
}
