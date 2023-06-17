CREATE TABLE IF NOT EXISTS collection (
    token TEXT NOT NULL UNIQUE PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS record (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_token TEXT NOT NULL,
    resource TEXT NOT NULL,
    frequency INTEGER NOT NULL,
    mean INTEGER NOT NULL,
    FOREIGN KEY (collection_token) REFERENCES tokens (token)
);