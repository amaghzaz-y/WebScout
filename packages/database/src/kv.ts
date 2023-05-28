import { createStorage, prefixStorage, Storage } from "unstorage";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";
import { ofetch } from 'ofetch'
import { MetaData } from "./types";

export default class KV {
	private rootKV: Storage
	private languageKV: Storage
	private indexKV: Storage
	private metaKV: Storage
	constructor() {
		this.rootKV = createStorage({
			driver: cloudflareKVBindingDriver({ binding: "WSKV" }),
		})
		this.languageKV = prefixStorage(this.rootKV, 'language')
		this.indexKV = prefixStorage(this.rootKV, 'index')
		this.metaKV = prefixStorage(this.rootKV, 'meta')
	}
	async getTokenizer(language: string): Promise<Uint8Array> {
		const lpURL = `https://pub-f198fbbd901d46eca8161360a537f010.r2.dev/packs/${language}.pack`
		let hasItem = await this.languageKV.hasItem(language)
		if (!hasItem) {
			const file = await ofetch(lpURL, { responseType: 'blob' })
			const tokenizer = new Uint8Array(await file.arrayBuffer())
			await this.languageKV.setItemRaw(language, tokenizer)
			return tokenizer
		}
		const langpack: Uint8Array = await this.languageKV.getItemRaw(language)
		return langpack
	}
	async getIndex(userID: string, projectID: string, indexID: number): Promise<Uint8Array | undefined> {
		const key = `${userID}:${projectID}:${indexID}`
		const index: Uint8Array | undefined = await this.indexKV.getItemRaw(key)
		return index
	}

	async setIndex(userID: string, projectID: string, indexID: number, index: Uint8Array) {
		const key = `${userID}:${projectID}:${indexID}`
		await this.indexKV.setItemRaw(key, index)
	}

	async Meta(userID: string, projectID: string): Promise<MetaData | null> {
		const key = `${userID}:${projectID}`
		const item = await this.metaKV.getItem(key)
		if (item == null) {
			return null
		}
		const meta: MetaData = JSON.parse(item?.toString() as string)
		return meta
	}
}