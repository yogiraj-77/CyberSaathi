"""CLI script to build or update the local persistent SQLite FTS5 search index.

Usage:
    python scripts/build_index.py [--max-rows-per-shard 5000] [--shards train-00000.parquet,...]
"""
import argparse
import glob
import os
import sys
import time
from pathlib import Path

# Add project root to sys.path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.indexer.index_builder import IndexBuilder, DEFAULT_DB_PATH, DEFAULT_DATA_DIR

def main():
    parser = argparse.ArgumentParser(description="Build CyberSaathi SQLite FTS5 search index.")
    parser.add_argument(
        "--data-dir",
        type=str,
        default=os.getenv("CYBERSAATHI_DATA_DIR", str(DEFAULT_DATA_DIR)),
        help="Path to folder containing downloaded parquet shards",
    )
    parser.add_argument(
        "--db-path",
        type=str,
        default=os.getenv("CYBERSAATHI_INDEX_PATH", str(DEFAULT_DB_PATH)),
        help="Path to SQLite index database file",
    )
    parser.add_argument(
        "--max-rows-per-shard",
        type=int,
        default=None,
        help="Maximum rows to index per shard (for quick setup/testing)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Re-index shards even if already marked as indexed",
    )
    args = parser.parse_args()

    data_dir = Path(args.data_dir)
    db_path = Path(args.db_path)

    print(f"Index Builder starting...")
    print(f"Data directory: {data_dir}")
    print(f"Database target: {db_path}")

    parquet_files = sorted(data_dir.glob("*.parquet"))
    if not parquet_files:
        # Check subfolder
        parquet_files = sorted(data_dir.glob("data/*.parquet"))

    if not parquet_files:
        print(f"ERROR: No parquet shards found in {data_dir}. Run scripts/download_dataset.py first.")
        sys.exit(1)

    print(f"Found {len(parquet_files)} parquet shards.")
    builder = IndexBuilder(db_path=db_path)

    start_time = time.time()
    total_docs_indexed = 0

    for idx, shard_path in enumerate(parquet_files, 1):
        shard_name = shard_path.name
        if not args.force and builder.is_shard_indexed(shard_name):
            print(f"[{idx}/{len(parquet_files)}] {shard_name} already indexed. Skipping.")
            continue

        print(f"[{idx}/{len(parquet_files)}] Indexing {shard_name}...")
        shard_start = time.time()
        
        def on_progress(current, total):
            pct = round((current / total) * 100, 1)
            sys.stdout.write(f"\r  -> Processing: {current}/{total} documents ({pct}%)")
            sys.stdout.flush()

        rows = builder.index_parquet_shard(
            shard_path,
            max_rows=args.max_rows_per_shard,
            progress_callback=on_progress,
        )
        sys.stdout.write("\n")
        elapsed = round(time.time() - shard_start, 2)
        print(f"  Completed {shard_name}: {rows} documents in {elapsed}s.")
        total_docs_indexed += rows

    builder.close()
    total_elapsed = round(time.time() - start_time, 2)
    print(f"\nAll shards processed in {total_elapsed}s.")
    
    # Display final stats
    builder_check = IndexBuilder(db_path=db_path)
    stats = builder_check.get_stats()
    builder_check.close()
    print("=" * 50)
    print("FINAL INDEX STATUS:")
    for k, v in stats.items():
        print(f"  {k}: {v}")
    print("=" * 50)

if __name__ == "__main__":
    main()
