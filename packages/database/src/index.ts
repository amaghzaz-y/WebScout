import { createStorage, prefixStorage } from "unstorage";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";
import { ofetch } from 'ofetch'

const kvStorage = createStorage({
	driver: cloudflareKVBindingDriver({ binding: "WSKV" }),
});

export const languageStorage = prefixStorage(kvStorage, 'language')
export const indexStorage = prefixStorage(kvStorage, 'index')


export const getTokenizer = async (language: string): Promise<Uint8Array> => {
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

export const getIndex = async (clientID: string, projectID: string): Promise<Uint8Array | undefined> => {
	const key = `${clientID}:${projectID}`
	const index: Uint8Array | undefined = await indexStorage.getItemRaw(key)
	return index
}