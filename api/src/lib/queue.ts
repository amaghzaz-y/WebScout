export default class QueueManager {
	queue_parser: Queue<Body>
	queue_indexer: Queue<Body>
	constructor(QBINDING_PARSER: any, QBINDING_INDEXER: any) {
		this.queue_parser = QBINDING_PARSER
		this.queue_indexer = QBINDING_INDEXER
	}
	async SendToParser(msg: any) {
		this.queue_parser.send(msg)
	}
	async SendToIndexer(msg: any) {
		this.queue_indexer.send(msg)
	}
}