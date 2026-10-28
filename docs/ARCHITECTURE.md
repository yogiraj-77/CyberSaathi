# CyberSaathi Dataset-First Architecture

## Data flow

```text
User message in website
        |
        v
Backend POST /api/chat
        |
        v
Normalize query and search local index
        |
        +---- sufficiently relevant passages found ----+
        |                                               |
        v                                               v
No reliable dataset match                         Summarization provider
        |                                         receives only retrieved
        v                                         passages + metadata
Gemini fallback                                          |
using GEMINI_API_KEY                                     v
        |                                         Grounded summary
        v                                               |
General answer labelled as fallback                    |
        |                                               |
        +-------------------+---------------------------+
                            |
                            v
              Structured answer + source label
                            |
                            v
              Website renders answer and sources
```

## Dataset

Hugging Face dataset repository:
https://huggingface.co/datasets/KanoonGPT/indian-legal-documents

The dataset card describes sharded Parquet files and fields including:
- `doc_id`
- `document_title`
- `document_type`
- `document_jurisdiction`
- `issuing_authority`
- `issue_date`
- `short_description`
- `text`

Do not assume every field is complete or accurate. The dataset card states that the public release does not include original source URLs/provenance, so never invent source links from the metadata.

## Retrieval and summary

- Keep raw shards under `data/raw/`.
- Keep a derived local search index under `data/index/`.
- Search locally before calling a generative model.
- Return top passages and metadata, not whole documents.
- Use a measured threshold; a keyword hit alone does not prove that the dataset answers the question.
- The summary provider must summarize only the retrieved evidence and identify its source records.
- Gemini fallback must be clearly labelled as a fallback and must not claim to have retrieved the answer from the dataset.

## API contract suggestion

Request:

```json
{
  "message": "What legal provisions may apply to online impersonation?",
  "language": "en"
}
```

Response:

```json
{
  "answer": "A grounded answer...",
  "answer_source": "dataset_summary",
  "dataset_match": true,
  "sources": [
    {
      "doc_id": "example-id",
      "title": "Document title from actual metadata",
      "document_type": "Act",
      "jurisdiction": "Central",
      "issue_date": "date if present"
    }
  ],
  "disclaimer": "General information, not legal advice."
}
```

These are illustrative shapes only; Antigravity must implement and test the actual contract.

## Important provider distinction

`LEGAL_SUMMARY_API_KEY` and `GEMINI_API_KEY` are separate configuration slots because the intended summarizer provider has not been specified. The `.env.example` defaults the provider setting to `gemini` as an option, but Antigravity must implement explicit validation and document which key is used. Never invent a provider URL. If using Gemini for both summarization and fallback, make that an explicit supported configuration.
