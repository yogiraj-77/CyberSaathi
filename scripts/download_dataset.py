"""Download the published Hugging Face dataset files into the local workspace.

Run:
    python scripts/download_dataset.py

This does not download data into the ZIP. It downloads it when run on your machine.
"""
from pathlib import Path
import os
from huggingface_hub import snapshot_download

ROOT = Path(__file__).resolve().parents[1]
DEST = Path(os.getenv(
    "CYBERSAATHI_DATA_DIR",
    str(ROOT / "data" / "raw" / "kanoongpt_indian_legal_documents"),
))

def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    print("Dataset: KanoonGPT/indian-legal-documents")
    print(f"Destination: {DEST}")
    print("Downloading published dataset files. This may take time and disk space...")
    path = snapshot_download(
        repo_id="KanoonGPT/indian-legal-documents",
        repo_type="dataset",
        local_dir=str(DEST),
        allow_patterns=["README.md", "LICENSE*", "data/*.parquet"],
    )
    print(f"Download completed: {path}")
    parquet_files = sorted(DEST.glob("data/*.parquet"))
    print(f"Parquet shards found: {len(parquet_files)}")
    if not parquet_files:
        print("WARNING: No data/*.parquet files found. Inspect the dataset repository layout.")
        raise SystemExit(2)
    print("Next: ask Antigravity to inspect the schema and build the local search index.")

if __name__ == "__main__":
    main()
