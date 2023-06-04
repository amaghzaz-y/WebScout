import { D1QB } from 'workers-qb'

export interface Env {
	DB: any
}

export default class DB {
	private DB: D1QB
	constructor(DB_BINDING: any) {
		this.DB = new D1QB(DB_BINDING)
	}
	async InsertPages() {
	}
}