import * as cheerio from 'cheerio';
import { ofetch } from 'ofetch';
import parseURL from 'parse-url'
import { Page } from './types';
import { nanoid } from 'nanoid';

export default class Spider {

	async Fetch(url: string): Promise<string | null> {
		try {
			const body = await fetch(url)
			let type = body.headers.get('Content-Type') as string

			if (type !== null) {
				let mime = type.split('/')
				if (mime[0].trim() == 'text' || mime[1].trim() == 'xml' || mime[1].trim() == 'json') {
					return await body.text()
				}
			}
			console.log(`SPIDER::TYPE::UNSUPPORTED::${type}`)
			return null
		}
		catch {
			console.log("SPIDER::FETCH::ERROR")
			return null
		}
	}

	async Parse(url: string): Promise<Page | null> {
		try {
			let document = await this.Fetch(url)
			if (document == null) {
				return null
			}
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
			console.log("PARSE::ERROR")
			return null
		}
	}

	async Crawl(EntryURL: string): Promise<Set<string> | null> {
		try {
			const body = await this.Fetch(EntryURL)
			if (body == null) {
				return null
			}
			const hostname = parseURL(EntryURL).resource
			const regex = /(?:https?|ftp):\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:% _\+.~#?&//=]*)/g;
			const matches = body.match(regex);
			if (matches == null) {
				console.log("CRAWL::DRY")
				return null
			}
			let urls = new Set<string>()
			for (const e of matches) {
				if (parseURL(e).resource === hostname) {
					urls.add(e)
				}
			}
			return urls
		}
		catch (e) {
			console.log(`Error :: ${EntryURL} :: ${e}`)
			return null
		}
	}
}