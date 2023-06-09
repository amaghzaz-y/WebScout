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
	language?: string
	content: string
}

export interface MetaIndex {
	projectID: string
	pages: PageMeta[]
}
