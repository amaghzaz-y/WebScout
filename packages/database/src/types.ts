export interface IndexMeta {
	userID: string
	projectID: string
	languages: string
	indexes: string[]
	documents: number
	size: number
}

export interface User {
	userID: string
	email: string
	username?: string
}

export interface Project {
	projectID: string
	userID: string
	projectName?: string
	createdAt: string
}

export interface Page {
	pageID: string
	projectID: string
	pageTitle: string
	url?: string
	language?: string
	tokens?: number
}

export interface PageStatus {
	pageID: string
	status: string
	lastUpdate: string
}