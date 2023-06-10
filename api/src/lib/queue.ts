import { CrawlQM, IndexQM, ParseQM } from "./types"

export default class QueueManager {
	private queue_parser: Queue<Body>
	private queue_indexer: Queue<Body>
	private queue_crawler: Queue<Body>

	constructor(QBINDING_PARSER: any, QBINDING_INDEXER: any, QBINDING_CRAWLER: any) {
		this.queue_parser = QBINDING_PARSER
		this.queue_indexer = QBINDING_INDEXER
		this.queue_crawler = QBINDING_CRAWLER
	}
	async SendToParser(msg: ParseQM) {
		this.queue_parser.send(msg as any)
	}
	async SendToIndexer(msg: IndexQM) {
		this.queue_indexer.send(msg as any)
	}
	async SendToCrawler(msg: CrawlQM) {
		this.queue_crawler.send(msg as any)
	}
}