import { Context, Hono } from 'hono'
import z from "zod"

const app = new Hono()

const scrapeSchema = z.object({

})


app.get('/', (c) => c.text('ws-spider'))

app.post('/scrape/:url', async (c: Context) => {
	const url = c.req.param('url')
	const res = await fetch(url)
	const body = await res.text()
	const regex = /(?:https?|ftp):\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:% _\+.~#?&//=]*)/g;
	const matches = body.match(regex);
	return c.text(JSON.stringify(matches))
})

export default app
