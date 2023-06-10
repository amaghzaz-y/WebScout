export interface Profile {
	name: string
	projects: string[]
}

export interface PageMeta {
	pageID: string
	url: string
	status: string
	lastUpdate: string
}

export interface Page {
	pageID: string
	title: string
	language: string
	content: string
}

export interface MetaIndex {
	projectID: string
	pages: PageMeta[]
}

export interface CrawledURL {
	projectID: string
	resources: Set<string>
}

export interface ParsedPage {
	projectID: string
	resources: Set<string>
}

export interface CrawlQM {
	projectID: string
	url: string
}

export interface ParseQM {
	projectID: string
	url: string
}

export interface IndexQM {
	projectID: string
	pageID: string
	language: string
}