import { initSync, WebScout } from "../pkg/webscout";
import wasm from "../pkg/webscout_bg.wasm"

export const InitEngine = () => {
	initSync(wasm);
}

export class WebScoutEngine {
	webscout?: WebScout;
	constructor(index: Uint8Array | null, tokenizer: Uint8Array) {
		this.webscout = new WebScout();
		if (index !== null) { this.webscout.deserialize_index(index); }
		this.webscout.deserialize_tokenizer(tokenizer);
		// sets up the query engine, optimizes memory
		this.webscout.setup()
	}
	Index(title: string, body: string) {
		this.webscout?.index(title, body)
	}
	Tokenize(word: string): string | undefined {
		return this.webscout?.tokenize(word);
	}
	// return JSON
	SearchAll(query: string): any {
		return JSON.parse(this.webscout?.search_all(query));
	}
	// return JSON
	Search(query: string): any {
		return JSON.parse(this.webscout?.search_above_average(query));
	}
	ExportIndex(): Uint8Array | undefined {
		return this.webscout?.export_index()
	}
}