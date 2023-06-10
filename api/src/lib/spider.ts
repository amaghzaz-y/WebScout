import * as cheerio from 'cheerio';
import { ofetch } from 'ofetch';
import parseURL from 'parse-url'
import { Page } from './types';
import { nanoid } from 'nanoid';

export default class Spider {

	async Fetch(url: string): Promise<string | null> {
		try {
			const body = await ofetch(url, { retry: 3, parseResponse: txt => txt })
			return body
		}
		catch (e) {
			throw e
		}
	}

	async Parse(url: string): Promise<Page> {
		try {
			let document = await this.Fetch(url) as string
			let $ = cheerio.load(document)
			let title = $('title').text()
			$('script').remove()
			let content = $('body').text().split('\n')
			let text: string = 'text'
			content.forEach(e => {
				text = text.concat(` ${e.trim()}`)
			})
			return {
				pageID: nanoid(),
				title: title.trim(),
				content: text
			}
		} catch (e) {
			throw e
		}
	}

	async Crawl(EntryURL: string): Promise<Set<string>> {
		const body = await this.Fetch(EntryURL) as string
		const hostname = parseURL(EntryURL).resource
		const regex = /(?:https?|ftp):\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:% _\+.~#?&//=]*)/g;
		const matches = body.match(regex);
		let urls = new Set<string>()
		matches?.forEach((e) => {
			let hn = parseURL(e).resource
			if (hn == hostname) {
				urls.add(e)
			}
		})
		return urls
	}
}