import { Context, Hono } from 'hono'
import z from "zod"
import * as cheerio from 'cheerio';

const app = new Hono()



app.get('/', (c) => c.text('ws-spider'))
app.get('/parse', async (c: Context) => {
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
app.get('/crawl', async (c: Context) => {
	const url = c.req.query('url')
	const res = await fetch(url as string)
	const body = await res.text()
	const regex = /(?:https?|ftp):\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:% _\+.~#?&//=]*)/g;
	const matches = body.match(regex);
	return c.text(JSON.stringify(matches))
})

export default app
