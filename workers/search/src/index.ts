import { Context, Hono } from 'hono'
import WebScoutEngine from "webscout"
import { languageStorage, indexStorage, getIndex, getTokenizer } from "database"





const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))




interface searchReqSchema {
	clientID: string,
	projectID: string,
	language: string,
	query: string,
	// at the current time, there are only two types : all or above average
	// optional
	type: string,
}

const schemaValidate = (body: searchReqSchema, c: Context) => {
	if (body.clientID == null) {
		return c.text("clientID field is empty");
	}
	if (body.projectID == null) {
		return c.text("projectID field is empty");
	}
	if (body.query == null) {
		return c.text("query field is empty");
	}
	if (body.language == null) {
		return c.text("language field is empty");
	}
}

const searchHandler = async (c: Context) => {
	const body: searchReqSchema = await c.req.json();
	// schema validation
	schemaValidate(body, c);
	const tokenizer = await getTokenizer(body.language);
	const index = await getIndex(body.clientID, body.projectID);
	if (index == undefined) {
		c.status(502);
		return c.text("error: index not found");
	}
	const ws = new WebScoutEngine(index, tokenizer, body.language)
	let results: string
	if (body.type == 'all') {
		results = ws.SearchAll(body.query)
	}
	else {
		results = ws.Search(body.query)
	}
	return c.json(JSON.parse(results))
}

app.post('/search', searchHandler)

export default app


