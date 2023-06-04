import { Hono } from 'hono'
import jwt from '@tsndr/cloudflare-worker-jwt'
const app = new Hono()

app.get('/', async (c) => c.text('Hello from ws-guard !'))

app.get('/signin', async (c) => {
	let s = await jwt.sign({
		data: 'hello'
	}, 'hello')
	return c.text(s)
})

export default app
