import { D1QB } from 'workers-qb'

export interface Env {
	DB: any
}

export default class DB {
	private DB: D1QB
	constructor(DB_BINDING: any) {
		this.DB = new D1QB(DB_BINDING)
	}
	async Migrate() {
		const userTable = await this.DB.createTable({
			tableName: 'User',
			schema: `
				userID TEXT PRIMARY KEY NOT NULL UNIQUE,
				email TEXT NOT NULL UNIQUE,
				name TEXT
			  `,
			ifNotExists: true,
		})
		const projectTable = await this.DB.createTable({
			tableName: 'Project',
			schema: `
				projectID TEXT PRIMARY KEY NOT NULL UNIQUE,
				userID TEXT NOT NULL,
				name TEXT,
				FOREIGN KEY(userID) REFERENCES User(userID)
			  `,
			ifNotExists: true,
		})
		const pageTable = await this.DB.createTable({
			tableName: 'Page',
			schema: `
				pageID TEXT PRIMARY KEY NOT NULL UNIQUE,
				projectID TEXT NOT NULL,
				title TEXT NOT NULL,
				url TEXT NOT NULL,
				language TEXT NOT NULL,
				tokens INTEGER,
				FOREIGN KEY(projectID) REFERENCES Project(projectID)
			  `,
			ifNotExists: true,
		})
		const pageStatusTable = await this.DB.createTable({
			tableName: 'PageStatus',
			schema: `
				pageID TEXT PRIMARY KEY NOT NULL UNIQUE,
				status TEXT NOT NULL,
				FOREIGN KEY(pageID) REFERENCES Page(pageID)
			  `,
			ifNotExists: true,
		})
	}
	async InsertPages() {
	}
}