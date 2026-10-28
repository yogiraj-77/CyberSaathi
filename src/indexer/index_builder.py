"""Persistent SQLite FTS5 index builder for Indian Legal Documents."""
from __future__ import annotations
import os
import sqlite3
import glob
from pathlib import Path
from typing import Optional, Callable
import pyarrow.parquet as pq

from src.indexer.chunker import chunk_document, clean_text

DEFAULT_DB_PATH = Path("./data/index/legal_documents.sqlite")
DEFAULT_DATA_DIR = Path("./data/raw/kanoongpt_indian_legal_documents/data")

SCHEMA_SQL = """
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;

CREATE TABLE IF NOT EXISTS ingestion_meta (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS indexed_shards (
    shard_filename TEXT PRIMARY KEY,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    row_count INTEGER
);

CREATE TABLE IF NOT EXISTS documents (
    doc_id TEXT PRIMARY KEY,
    document_title TEXT,
    document_type TEXT,
    document_jurisdiction TEXT,
    issuing_authority TEXT,
    issue_date TEXT,
    short_description TEXT,
    chunk_count INTEGER
);

CREATE TABLE IF NOT EXISTS chunks (
    chunk_id TEXT PRIMARY KEY,
    doc_id TEXT,
    chunk_index INTEGER,
    chunk_text TEXT,
    FOREIGN KEY(doc_id) REFERENCES documents(doc_id)
);

CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
    chunk_id UNINDEXED,
    doc_id UNINDEXED,
    document_title,
    document_type,
    document_jurisdiction,
    chunk_text,
    tokenize = 'porter unicode61 remove_diacritics 2'
);
"""

class IndexBuilder:
    def __init__(self, db_path: Path | str = DEFAULT_DB_PATH):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(str(self.db_path))
        self.conn.execute("PRAGMA journal_mode = WAL;")
        self.conn.execute("PRAGMA synchronous = NORMAL;")
        self._init_schema()

    def _init_schema(self) -> None:
        self.conn.executescript(SCHEMA_SQL)
        self.conn.commit()

    def is_shard_indexed(self, shard_name: str) -> bool:
        cursor = self.conn.cursor()
        cursor.execute("SELECT 1 FROM indexed_shards WHERE shard_filename = ?", (shard_name,))
        return cursor.fetchone() is not None

    def mark_shard_indexed(self, shard_name: str, row_count: int) -> None:
        self.conn.execute(
            "INSERT OR REPLACE INTO indexed_shards (shard_filename, row_count) VALUES (?, ?)",
            (shard_name, row_count),
        )
        self.conn.commit()

    def get_stats(self) -> dict:
        cursor = self.conn.cursor()
        doc_count = cursor.execute("SELECT COUNT(*) FROM documents").fetchone()[0]
        chunk_count = cursor.execute("SELECT COUNT(*) FROM chunks").fetchone()[0]
        shard_count = cursor.execute("SELECT COUNT(*) FROM indexed_shards").fetchone()[0]
        db_size_bytes = self.db_path.stat().st_size if self.db_path.exists() else 0
        return {
            "db_path": str(self.db_path),
            "documents_indexed": doc_count,
            "chunks_indexed": chunk_count,
            "shards_processed": shard_count,
            "db_size_mb": round(db_size_bytes / (1024 * 1024), 2),
        }

    def index_parquet_shard(
        self,
        shard_path: Path | str,
        max_rows: Optional[int] = None,
        progress_callback: Optional[Callable[[int, int], None]] = None,
    ) -> int:
        shard_path = Path(shard_path)
        shard_name = shard_path.name
        
        table = pq.read_table(
            str(shard_path),
            columns=[
                "doc_id",
                "document_title",
                "document_type",
                "document_jurisdiction",
                "issuing_authority",
                "issue_date",
                "short_description",
                "text",
            ],
        )
        
        total_rows = len(table)
        if max_rows and max_rows < total_rows:
            total_rows = max_rows

        doc_batch = []
        chunk_batch = []
        fts_batch = []
        batch_size = 200

        cursor = self.conn.cursor()

        for idx in range(total_rows):
            doc_id = str(table["doc_id"][idx] or "")
            if not doc_id:
                continue

            title = clean_text(str(table["document_title"][idx] or ""))
            doc_type = clean_text(str(table["document_type"][idx] or ""))
            jurisdiction = clean_text(str(table["document_jurisdiction"][idx] or ""))
            authority = clean_text(str(table["issuing_authority"][idx] or ""))
            issue_date = clean_text(str(table["issue_date"][idx] or ""))
            short_desc = clean_text(str(table["short_description"][idx] or ""))
            raw_text = str(table["text"][idx] or "")

            chunks = chunk_document(doc_id, raw_text)
            chunk_count = len(chunks)

            doc_batch.append((
                doc_id, title, doc_type, jurisdiction, authority, issue_date, short_desc, chunk_count
            ))

            for c in chunks:
                chunk_batch.append((c["chunk_id"], doc_id, c["chunk_index"], c["text"]))
                fts_batch.append((
                    c["chunk_id"], doc_id, title, doc_type, jurisdiction, c["text"]
                ))

            if len(doc_batch) >= batch_size:
                cursor.executemany(
                    "INSERT OR REPLACE INTO documents VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    doc_batch,
                )
                cursor.executemany(
                    "INSERT OR REPLACE INTO chunks VALUES (?, ?, ?, ?)",
                    chunk_batch,
                )
                cursor.executemany(
                    "INSERT INTO chunks_fts (chunk_id, doc_id, document_title, document_type, document_jurisdiction, chunk_text) VALUES (?, ?, ?, ?, ?, ?)",
                    fts_batch,
                )
                self.conn.commit()
                doc_batch.clear()
                chunk_batch.clear()
                fts_batch.clear()

            if progress_callback and (idx % 250 == 0 or idx == total_rows - 1):
                progress_callback(idx + 1, total_rows)

        if doc_batch:
            cursor.executemany(
                "INSERT OR REPLACE INTO documents VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                doc_batch,
            )
            cursor.executemany(
                "INSERT OR REPLACE INTO chunks VALUES (?, ?, ?, ?)",
                chunk_batch,
            )
            cursor.executemany(
                "INSERT INTO chunks_fts (chunk_id, doc_id, document_title, document_type, document_jurisdiction, chunk_text) VALUES (?, ?, ?, ?, ?, ?)",
                fts_batch,
            )
            self.conn.commit()

        self.mark_shard_indexed(shard_name, total_rows)
        return total_rows

    def close(self) -> None:
        if self.conn:
            self.conn.close()
