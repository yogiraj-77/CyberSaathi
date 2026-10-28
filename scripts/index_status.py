"""Inspect the status and health of the local legal search index.

Usage:
    python scripts/index_status.py
"""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.indexer.index_builder import IndexBuilder, DEFAULT_DB_PATH

def main():
    db_path = Path(os.getenv("CYBERSAATHI_INDEX_PATH", str(DEFAULT_DB_PATH)))
    if not db_path.exists():
        print(f"Index database does NOT exist at: {db_path}")
        print("Run: python scripts/build_index.py to create it.")
        sys.exit(1)

    builder = IndexBuilder(db_path=db_path)
    stats = builder.get_stats()
    builder.close()

    print("CyberSaathi Index Status:")
    print("------------------------")
    for k, v in stats.items():
        print(f"  {k:20}: {v}")
    
    if stats["documents_indexed"] > 0:
        print("\nIndex is READY for queries.")
    else:
        print("\nWARNING: Index exists but has 0 documents.")

if __name__ == "__main__":
    main()
