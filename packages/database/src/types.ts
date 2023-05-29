export interface IndexMeta {
	userID: string
	projectID: string
	languages: string
	indexCount: number
	indexes: string[]
	documents: number
	size: number
}

export interface User {
	userID: string
	email: string
	name?: string
}

export interface Project {
	projectID: string
	userID: string
	name?: string
	createdAt: string
}

export interface Page {
	pageID: string
	projectID: string
	title: string
	url?: string
	language?: string
	tokens?: number
}