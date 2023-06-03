import { Context, Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('ws-spider'))


app.get('/scrape', async (c: Context) => {
	const res = await fetch('https://makerspace-amiens.fr/sitemap.xml')
	const body = await res.text()
	const regex = /(?:https?|ftp):\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:% _\+.~#?&//=]*)/g;
	const matches = body.match(regex);
	return c.text(JSON.stringify(matches))
})

export default app
