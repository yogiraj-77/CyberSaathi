"""CLI tool to test queries against the local search index."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.indexer.search import LegalSearcher

def main():
    searcher = LegalSearcher()
    queries = [
        "What legal provisions apply to cheating by personation and hacking under IT Act?",
        "Identity theft using computer password and electronic signature",
        "How to bake a chocolate cake at home?",
    ]

    for q in queries:
        print("=" * 60)
        print(f"QUERY: {q}")
        res = searcher.search(q, top_k=3)
        print(f"Is Sufficient Match: {res['is_sufficient']} (Top Score: {res['top_score']}, Threshold: {res['threshold']})")
        print(f"Matches count: {len(res['matches'])}")
        for idx, m in enumerate(res["matches"], 1):
            print(f"  [{idx}] Score: {m['score']} | {m['title']} ({m['document_type']} - {m['jurisdiction']})")
            print(f"      Doc ID: {m['doc_id']}")
            print(f"      Text Snippet: {m['text'][:200]}...")
    searcher.close()

if __name__ == "__main__":
    main()
