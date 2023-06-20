use alloc::{string::String, vec::Vec};

use crate::index::{Document, Index};

struct KV {}
impl KV {
    fn new() -> KV {
        KV {}
    }
    #[cfg(any(target_family = "unix", target_os = "windows"))]
    fn read_documents(&self, document_ids: &Vec<String>) -> Vec<Document> {
        let tree = sled::open("ws.db").unwrap();
        let mut docs: Vec<Document> = Vec::new();
        for id in document_ids {
            let bytes = tree.get(id).unwrap().unwrap().to_vec();
            docs.push(Document::deserialize(bytes));
        }
        return docs;
    }

    #[cfg(any(target_family = "unix", target_os = "windows"))]
    fn read_index(&self, index_id: &str) -> Index {
        let tree = sled::open("ws.db").unwrap();
        let bytes = tree.get(index_id).unwrap().unwrap().to_vec();
        Index::deserialize(bytes)
    }

    #[cfg(any(target_family = "unix", target_os = "windows"))]
    fn put_document(&self, document: Document) {
        let tree = sled::open("ws.db").unwrap();
        let bytes = document.serialize();
        tree.insert(document.id, bytes).unwrap();
    }
    
	#[cfg(any(target_family = "unix", target_os = "windows"))]
    fn put_index(&self, index: Index) {
        let tree = sled::open("ws.db").unwrap();
        let bytes = index.serialize();
        tree.insert(index.id, bytes).unwrap();
    }
}
