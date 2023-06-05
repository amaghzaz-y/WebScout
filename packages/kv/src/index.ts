import { ofetch } from 'ofetch'

export default class KV {
	private KV: KVNamespace
	constructor(kvBinding: KVNamespace) {
		this.KV = kvBinding
	}
	async getTokenizer(language: string): Promise<Uint8Array> {
		const lpURL = `https://pub-f198fbbd901d46eca8161360a537f010.r2.dev/packs/${language}.pack`
		let file: ArrayBuffer | null = await this.KV.get(`language:${language}`, { cacheTtl: 21600, type: 'arrayBuffer' })
		if (file == null) {
			const blob = await ofetch(lpURL, { responseType: 'blob' })
			const tokenizer = new Uint8Array(await blob.arrayBuffer())
			await this.KV.put(`language:${language}`, tokenizer)
			return tokenizer
		}
		const tokenizer = new Uint8Array(file)
		return tokenizer
	}

	async getIndex(projectID: string, indexID: number): Promise<Uint8Array | null> {
		const key = `index:${projectID}:${indexID}`
		const file: ArrayBuffer | null = await this.KV.get(key, { cacheTtl: 600, type: 'arrayBuffer' })
		if (file !== null) {
			return new Uint8Array(file)
		}
		return null
	}

	async setIndex(projectID: string, indexID: number, index: Uint8Array) {
		const key = `index:${projectID}:${indexID}`
		await this.KV.put(key, index)
	}
}