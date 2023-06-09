export default class QueueManager {
	queue_parser: Queue<Body>
	queue_indexer: Queue<Body>
	queue_crawler: Queue<Body>

	constructor(QBINDING_PARSER: any, QBINDING_INDEXER: any, QBINDING_CRAWLER: any) {
		this.queue_parser = QBINDING_PARSER
		this.queue_indexer = QBINDING_INDEXER
		this.queue_crawler = QBINDING_CRAWLER
	}
	async SendToParser(msg: any) {
		this.queue_parser.send(msg)
	}
	async SendToIndexer(msg: any) {
		this.queue_indexer.send(msg)
	}
	async SendToCrawler(msg: any) {
		this.queue_crawler.send(msg)
	}
}