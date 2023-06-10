import { string } from "zod"

export interface Profile {
	name: string
	projects: string[]
}

export interface Project {
	projectID: string
	name: string
	language: string
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
	content: string
}

export interface MetaIndex {
	projectID: string
	pages: PageMeta[]
}

export interface CrawledPages {
	projectID: string
	resources: Set<string>
}

export interface ParsedPages {
	projectID: string
	resources: Set<string>
}

export interface IndexedPages {
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
}