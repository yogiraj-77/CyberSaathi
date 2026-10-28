"""Text chunking and normalization for legal statutes and documents."""
from __future__ import annotations
import re
from typing import List, Dict, Any

# Regex to find section / article / paragraph headers in Indian statutes
SECTION_PATTERN = re.compile(
    r"(?:\n\s*(?:Section|Article|Rule|Clause|Order|SCHEDULE|CHAPTER|PART)\s+[0-9A-Za-z\(\)\.\-]+|\n\s*[0-9]+\.\s+)",
    re.IGNORECASE,
)

def clean_text(text: str | None) -> str:
    """Normalize whitespace and strip non-printable characters."""
    if not text:
        return ""
    # Normalize unicode spaces & line breaks
    text = re.sub(r"[\r\t\f\v]", " ", text)
    # Remove null bytes or control characters
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]", "", text)
    # Collapse multiple consecutive newlines to maximum 2
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Collapse repeated spaces
    text = re.sub(r"[ ]{2,}", " ", text)
    return text.strip()


def chunk_document(
    doc_id: str,
    text: str | None,
    max_chunk_chars: int = 1500,
    overlap_chars: int = 200,
) -> List[Dict[str, Any]]:
    """Split document text into overlapping chunks respecting statutory section boundaries."""
    cleaned = clean_text(text)
    if not cleaned:
        return []

    if len(cleaned) <= max_chunk_chars:
        return [{
            "chunk_id": f"{doc_id}#c0",
            "doc_id": doc_id,
            "chunk_index": 0,
            "text": cleaned,
            "char_count": len(cleaned),
        }]

    # Identify potential natural split boundaries (sections, paragraphs)
    split_points = [0]
    for match in SECTION_PATTERN.finditer(cleaned):
        start = match.start()
        if start > 0 and start not in split_points:
            split_points.append(start)
    split_points.append(len(cleaned))
    split_points = sorted(list(set(split_points)))

    # Assemble chunks based on split points with character budget
    chunks: List[Dict[str, Any]] = []
    chunk_index = 0
    current_start = 0

    while current_start < len(cleaned):
        target_end = min(current_start + max_chunk_chars, len(cleaned))
        
        if target_end == len(cleaned):
            actual_end = target_end
        else:
            # Find the closest section split point within the chunk budget
            valid_splits = [p for p in split_points if current_start + 400 <= p <= target_end]
            if valid_splits:
                actual_end = valid_splits[-1]
            else:
                # Fallback to paragraph break or sentence break
                p_break = cleaned.rfind("\n\n", current_start + 400, target_end)
                if p_break != -1:
                    actual_end = p_break + 2
                else:
                    dot_break = cleaned.rfind(". ", current_start + 400, target_end)
                    if dot_break != -1:
                        actual_end = dot_break + 2
                    else:
                        actual_end = target_end

        chunk_str = cleaned[current_start:actual_end].strip()
        if chunk_str:
            chunks.append({
                "chunk_id": f"{doc_id}#c{chunk_index}",
                "doc_id": doc_id,
                "chunk_index": chunk_index,
                "text": chunk_str,
                "char_count": len(chunk_str),
            })
            chunk_index += 1

        if actual_end >= len(cleaned):
            break

        # Calculate next start with overlap
        next_start = actual_end - overlap_chars
        # Prevent infinite loops
        if next_start <= current_start:
            next_start = actual_end
        current_start = next_start

    return chunks
