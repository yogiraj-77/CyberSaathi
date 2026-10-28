"""Search and retrieval engine over the persistent SQLite FTS5 legal index."""
from __future__ import annotations
import re
import sqlite3
from pathlib import Path
from typing import List, Dict, Any, Optional

DEFAULT_DB_PATH = Path("./data/index/legal_documents.sqlite")
DEFAULT_MIN_SCORE = 35.0

# High-priority terms for Indian cyber laws
CYBER_BOOST_TERMS = [
    "cyber", "information technology", "it act", "computer", "electronic",
    "hacking", "impersonation", "phishing", "fraud", "identity theft",
    "section 66", "section 66c", "section 66d", "section 67", "66d",
    "bns 318", "bns 319", "cheating", "data privacy", "otp", "upi",
    "stolen", "obscenity", "pornography", "defamation", "stalking",
    "ransomware", "trojan", "virus", "malware", "scam", "financial fraud"
]

LEGAL_CONTEXT_WORDS = [
    "act", "law", "statute", "penal", "code", "section", "court", "offence",
    "offense", "crime", "punishment", "penalty", "police", "fir", "complaint",
    "jurisdiction", "legal", "illegal", "prosecution", "investigation", "rights"
]

def extract_query_keywords(query: str) -> List[str]:
    clean = re.sub(r'[\'\"*^\(\)\{\}\[\]\:\+\-\~]', " ", query)
    tokens = [t.strip().lower() for t in clean.split() if len(t.strip()) > 1]
    stop_words = {
        "the", "a", "an", "is", "in", "at", "of", "on", "for", "to", "and", "or",
        "what", "how", "can", "should", "i", "do", "my", "me", "under", "with",
        "are", "about", "from", "by", "this", "that", "there", "were", "was"
    }
    return [t for t in tokens if t not in stop_words]

def sanitize_fts5_query(keywords: List[str]) -> str:
    if not keywords:
        return '"law"'
    if len(keywords) <= 2:
        return " AND ".join(f'"{t}"' for t in keywords)
    else:
        # Match primary keywords with OR
        return " OR ".join(f'"{t}"' for t in keywords[:5])

class LegalSearcher:
    def __init__(self, db_path: Path | str = DEFAULT_DB_PATH, min_score: float = DEFAULT_MIN_SCORE):
        self.db_path = Path(db_path)
        self.min_score = min_score
        if not self.db_path.exists():
            raise FileNotFoundError(f"Index database not found at {self.db_path}. Build the index first.")
        self.conn = sqlite3.connect(str(self.db_path), check_same_thread=False)
        self.conn.row_factory = sqlite3.Row

    def search(
        self,
        query: str,
        top_k: int = 5,
        min_score: Optional[float] = None,
    ) -> Dict[str, Any]:
        """Fast FTS5 search directly over chunks_fts table with bm25 ranking and intent calibration."""
        threshold = min_score if min_score is not None else self.min_score
        clean_q = query.strip()
        if not clean_q:
            return {"matches": [], "is_sufficient": False, "top_score": 0.0, "query": query}

        keywords = extract_query_keywords(clean_q)
        fts_query = sanitize_fts5_query(keywords)
        cursor = self.conn.cursor()

        sql = """
        SELECT 
            chunk_id,
            doc_id,
            document_title,
            document_type,
            document_jurisdiction,
            chunk_text,
            bm25(chunks_fts, 5.0, 2.0, 1.0, 1.0) AS raw_score
        FROM chunks_fts
        WHERE chunks_fts MATCH ?
        ORDER BY raw_score ASC
        LIMIT ?
        """

        try:
            cursor.execute(sql, (fts_query, top_k * 3))
            rows = cursor.fetchall()
        except sqlite3.OperationalError:
            simplified_query = " OR ".join(f'"{w}"' for w in keywords[:2]) if keywords else '"law"'
            cursor.execute(sql, (simplified_query, top_k * 3))
            rows = cursor.fetchall()

        results = []
        q_lower = clean_q.lower()
        has_cyber_term = any(t in q_lower for t in CYBER_BOOST_TERMS)
        has_legal_context = any(w in q_lower for w in LEGAL_CONTEXT_WORDS)

        for row in rows:
            raw_score = float(row["raw_score"])
            norm_score = max(0.0, -raw_score)

            title = str(row["document_title"] or "")
            text = str(row["chunk_text"] or "")
            title_lower = title.lower()
            text_lower = text.lower()

            # Calculate query term coverage in matched chunk
            matched_terms = sum(1 for kw in keywords if kw in text_lower or kw in title_lower)
            coverage = matched_terms / max(1, len(keywords))

            # Discard false keyword hits from unrelated queries (e.g. recipe words)
            if not has_cyber_term and not has_legal_context and coverage < 0.5:
                continue

            boost = 1.0
            if has_cyber_term:
                if "information technology" in title_lower or "information technology act" in text_lower:
                    boost += 3.5
                if "penal" in title_lower or "nyaya" in title_lower:
                    boost += 2.0
                if any(sec in text_lower for sec in ["section 66", "66c", "66d", "67"]):
                    boost += 3.0

            final_score = round(norm_score * boost * (0.5 + 0.5 * coverage), 2)

            results.append({
                "chunk_id": row["chunk_id"],
                "doc_id": row["doc_id"],
                "title": title,
                "document_type": row["document_type"] or "Act/Statute",
                "jurisdiction": row["document_jurisdiction"] or "Central",
                "issue_date": "",
                "text": text,
                "score": final_score,
                "coverage": round(coverage, 2),
            })

        seen_docs = set()
        deduped = []
        for r in results:
            if r["doc_id"] not in seen_docs or len(seen_docs) < top_k:
                seen_docs.add(r["doc_id"])
                deduped.append(r)
            if len(deduped) >= top_k:
                break

        deduped.sort(key=lambda x: x["score"], reverse=True)
        top_score = deduped[0]["score"] if deduped else 0.0
        
        # Must pass threshold AND have meaningful legal relevance
        is_sufficient = bool(top_score >= threshold and len(deduped) > 0)
        if not has_cyber_term and not has_legal_context:
            is_sufficient = False

        return {
            "query": query,
            "matches": deduped if is_sufficient else [],
            "top_score": top_score,
            "threshold": threshold,
            "is_sufficient": is_sufficient,
        }

    def close(self) -> None:
        if self.conn:
            self.conn.close()
