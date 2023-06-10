import { ofetch } from 'ofetch'
import { CrawledURL, MetaIndex, Page, ParsedPage, Profile, Project } from './types'

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

	async setPage(projectID: string, page: Page) {
		const key = `page:${projectID}:${page.pageID}`
		await this.KV.put(key, JSON.stringify(page))
	}

	async getPage(projectID: string, pageID: string): Promise<Page> {
		const key = `page:${projectID}:${pageID}`
		const body = await this.KV.get(key)
		if (body == null) {
			throw new Error('ERROR:KV: Page Not Found')
		}
		return JSON.parse(body)
	}


	async setProject(projectID: string, project: Project) {
		const key = `project:${projectID}`
		await this.KV.put(key, JSON.stringify(project))
	}

	async getProject(projectID: string): Promise<Project> {
		const key = `project:${projectID}`
		const body = await this.KV.get(key)
		if (body == null) {
			throw new Error('ERROR:KV: Project Not Found')
		}
		return JSON.parse(body)
	}


	async setMetaIndex(mindex: MetaIndex) {
		const key = `metaindex:${mindex.projectID}`
		await this.KV.put(key, JSON.stringify(mindex))
	}

	async getMetaIndex(projectID: string): Promise<MetaIndex> {
		const key = `metaindex:${projectID}`
		const body = await this.KV.get(key)
		if (body == null) {
			throw new Error('ERROR:KV: MetaIndex Not Found')
		}
		return JSON.parse(body)
	}
	async getProfile(): Promise<Profile> {
		const key = `profile`
		const body = await this.KV.get(key)
		if (body == null) {
			throw new Error('ERROR:KV: Profile Not Found')
		}
		return JSON.parse(body)
	}
	async setProfile(profile: Profile) {
		const key = `profile`
		await this.KV.put(key, JSON.stringify(profile))
	}
	async setCrawledURL(projectID: string, crawledurl: CrawledURL) {
		const key = `crawledurl:${projectID}`
		await this.KV.put(key, JSON.stringify(crawledurl))
	}
	async getCrawledURL(projectID: string): Promise<CrawledURL> {
		const key = `crawledurl:${projectID}`
		const body = await this.KV.get(key)
		if (body == null) {
			throw new Error('ERROR:KV: CrawledURL Not Found')
		}
		return JSON.parse(body)
	}
	async setParsedPage(projectID: string, parsedPage: ParsedPage) {
		const key = `parsedpage:${projectID}`
		await this.KV.put(key, JSON.stringify(parsedPage))
	}
	async getParsedPage(projectID: string): Promise<ParsedPage> {
		const key = `parsedpage:${projectID}`
		const body = await this.KV.get(key)
		if (body == null) {
			throw new Error('ERROR:KV: ParsedPage Not Found')
		}
		return JSON.parse(body)
	}
}