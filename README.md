# CyberSaathi Antigravity Starter Pack

This folder is a **starter scaffold**, not the complete finished application and not a copy of the dataset. It gives Antigravity the requirements and scripts to download the dataset into this workspace, build a searchable local index, and implement the two-stage answer flow.

## Important dataset note

Dataset: https://huggingface.co/datasets/KanoonGPT/indian-legal-documents

The dataset is published as sharded Parquet files with fields such as `doc_id`, `document_title`, `document_type`, `document_jurisdiction`, `issuing_authority`, `issue_date`, `short_description`, and `text`. Its published dataset card states Apache-2.0 licensing, but metadata/text can contain extraction errors and important legal facts must be checked against official sources. See the dataset card and current terms before using or redistributing it.

**The dataset is intentionally not included in this ZIP.** It is a sizeable dataset and should be downloaded by Antigravity or the setup script directly into `data/raw/` on your computer.

## Recommended workflow

1. Open this extracted folder as the Antigravity workspace.
2. Open `ANTIGRAVITY_MASTER_PROMPT.md` and paste its contents into Antigravity.
3. Ask Antigravity to inspect the workspace and follow the prompt in phases.
4. Create a Python virtual environment and install `requirements.txt`.
5. Copy `.env.example` to `.env` and add API keys locally. Never paste real keys into prompts or commit them.
6. Run `python scripts/download_dataset.py` to download the published dataset shards into `data/raw/kanoongpt_indian_legal_documents/`.
7. Ask Antigravity to finish/verify ingestion, retrieval, answer routing, frontend integration, tests, and run instructions.

## Intended answer-routing logic

1. Search the local dataset/index first.
2. If there are sufficiently relevant legal-document passages, send those passages and metadata to a configured summarization provider. The summary must be grounded in the retrieved text and include the document title/type/jurisdiction/date where available.
3. If retrieval has no sufficiently relevant results, use the Google Gemini API configured with `GEMINI_API_KEY` for a general fallback response. The fallback must clearly say that the local dataset did not provide a sufficiently relevant match, avoid inventing citations or legal sections, and direct users to official sources for important decisions.
4. If both providers fail, return a clear error and official reporting links; do not silently fabricate an answer.

Do not decide whether an answer exists from one keyword alone. Implement relevance thresholds, query normalization, source metadata, and tests for false matches. The dataset contains many types of legal documents, not only cybercrime statutes, so filter and rank results carefully.

## Files

- `ANTIGRAVITY_MASTER_PROMPT.md` — prompt for Antigravity to complete the project.
- `.env.example` — environment variable names only; no secrets.
- `requirements.txt` — Python starter dependencies.
- `scripts/download_dataset.py` — downloads the dataset files into the workspace.
- `docs/ARCHITECTURE.md` — expected architecture and data flow.
- `docs/SAFETY_AND_EVALUATION.md` — legal-answer safety and test requirements.
- `data/raw/` — downloaded source data goes here (ignored by Git).
- `data/index/` — generated search index goes here (ignored by Git).

This pack is designed to be adaptable to the existing CyberSaathi frontend. Antigravity should inspect the actual workspace and preserve working code rather than blindly replacing it.
