import { Context, Hono } from 'hono'
import { ofetch } from 'ofetch'
import WebScoutEngine from "webscout-core"
import { languageStorage, indexStorage } from "database"





const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))


const getTokenizer = async (language: string): Promise<Uint8Array> => {
	// url to get language packs
	const lpURL = `https://pub-f198fbbd901d46eca8161360a537f010.r2.dev/packs/${language}.pack`
	let hasItem = await languageStorage.hasItem(language)
	if (!hasItem) {
		const file = await ofetch(lpURL, { responseType: 'blob' })
		const langpack = new Uint8Array(await file.arrayBuffer())
		await languageStorage.setItemRaw(language, langpack)
		return langpack
	}
	const langpack: Uint8Array = await languageStorage.getItemRaw(language)
	return langpack
}

const getIndex = async (clientID: string, projectID: string): Promise<Uint8Array | undefined> => {
	const key = `${clientID}:${projectID}`
	const index: Uint8Array | undefined = await indexStorage.getItemRaw(key)
	return index
}

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


