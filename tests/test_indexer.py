"""Unit and integration tests for indexing and chunking."""
import pytest
from pathlib import Path
from src.indexer.chunker import chunk_document, clean_text
from src.indexer.search import LegalSearcher, sanitize_fts5_query, extract_query_keywords

def test_clean_text():
    raw = "  Hello \t\t world!\r\n\n\nSection 66.  "
    cleaned = clean_text(raw)
    assert "Hello world!" in cleaned
    assert "Section 66." in cleaned
    assert "\t" not in cleaned

def test_chunk_document_short():
    doc_id = "test_doc_1"
    text = "Short notification text under Information Technology Act."
    chunks = chunk_document(doc_id, text, max_chunk_chars=500)
    assert len(chunks) == 1
    assert chunks[0]["chunk_id"] == "test_doc_1#c0"
    assert chunks[0]["text"] == text

def test_chunk_document_long_sections():
    doc_id = "test_doc_long"
    text = (
        "Preamble text.\n\n"
        "Section 1. Short title and extent.\n" + ("This Act applies to all India. " * 30) + "\n\n"
        "Section 2. Definitions and terms.\n" + ("In this Act computer means any device. " * 30)
    )
    chunks = chunk_document(doc_id, text, max_chunk_chars=600, overlap_chars=100)
    assert len(chunks) >= 2
    for c in chunks:
        assert c["doc_id"] == doc_id
        assert len(c["text"]) > 0

def test_query_keyword_extraction():
    q = "What is the penalty for hacking under Section 66 of IT Act?"
    kw = extract_query_keywords(q)
    assert "penalty" in kw
    assert "hacking" in kw
    assert "section" in kw
    assert "66" in kw
    assert "what" not in kw  # stop word removed

def test_legal_search_dataset_match():
    searcher = LegalSearcher()
    res = searcher.search("Identity theft using electronic signature under IT Act", top_k=3)
    searcher.close()
    assert res["is_sufficient"] is True
    assert res["top_score"] >= res["threshold"]
    assert len(res["matches"]) > 0
    assert any("Information Technology" in m["title"] for m in res["matches"])

def test_legal_search_unrelated_query_rejection():
    searcher = LegalSearcher()
    # Unrelated everyday queries must be rejected and not produce false legal matches
    res = searcher.search("How to bake chocolate cake with sugar at home", top_k=3)
    searcher.close()
    assert res["is_sufficient"] is False
    assert len(res["matches"]) == 0
