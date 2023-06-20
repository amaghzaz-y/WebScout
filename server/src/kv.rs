use webscout_core::index::{Document, Index};

struct KV {}
impl KV {
    fn new() -> KV {
        KV {}
    }
    fn read_documents(&self, document_ids: &Vec<String>) -> Vec<Document> {
        let tree = sled::open("ws.db").unwrap();
        let mut docs: Vec<Document> = Vec::new();
        for id in document_ids {
            let bytes = tree.get(id).unwrap().unwrap().to_vec();
            docs.push(Document::deserialize(bytes));
        }
        return docs;
    }

    fn read_index(&self, index_id: &str) -> Index {
        let tree = sled::open("ws.db").unwrap();
        let bytes = tree.get(index_id).unwrap().unwrap().to_vec();
        Index::deserialize(bytes)
    }

    fn put_document(&self, document: Document) {
        let tree = sled::open("ws.db").unwrap();
        let bytes = document.serialize();
        tree.insert(document.id, bytes).unwrap();
    }

    fn put_index(&self, index: Index) {
        let tree = sled::open("ws.db").unwrap();
        let bytes = index.serialize();
        tree.insert(index.id, bytes).unwrap();
    }
}
