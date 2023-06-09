import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { InitEngine } from "webscout"
import searchHandler from './handlers/search'
import indexHandler from './handlers'

// instantiate wasm
InitEngine()

const app = new Hono()

app.use("/*", cors())

app.get('/', async (c) => { return c.text("ws-api says hello !") })

app.post('/search', searchHandler)
app.post('/index', indexHandler)


export default app


