"""Dataset-first query routing engine for CyberSaathi."""
from __future__ import annotations
import logging
from typing import Dict, Any, Optional

from src.backend.config import settings
from src.indexer.search import LegalSearcher
from src.backend.providers.gemini_provider import GeminiProvider

logger = logging.getLogger("cybersaathi.routing")

DISCLAIMER_EN = (
    "CyberSaathi provides general educational guidance based on Indian law and does not replace "
    "advice from a qualified lawyer, police investigation, or official legal determination. "
    "Legal applicability depends on the specific facts of your case."
)

DISCLAIMER_TE = (
    "సైబర్‌సాథీ భారతీయ చట్టాల ఆధారంగా సాధారణ విద్యాపరమైన సమాచారాన్ని మాత్రమే అందిస్తుంది. "
    "ఇది న్యాయవాది సలహా లేదా పోలీసు విచారణకు ప్రత్యామ్నాయం కాదు."
)

OFFLINE_FALLBACK_GUIDANCE = (
    "A. Understanding Your Situation\n"
    "If you are facing financial cyber fraud, unauthorized account transactions, phishing, or harassment, "
    "swift action is critical.\n\n"
    "B. Immediate Actions (Golden Hour)\n"
    "1. Financial Cyber Fraud: Call the National Cybercrime Helpline at 1930 immediately to freeze fraudulent transfers.\n"
    "2. Report Online: Register your formal complaint at the official portal: https://cybercrime.gov.in/\n"
    "3. Preserve Evidence: Do not delete SMS alerts, UPI transaction IDs, WhatsApp chats, or suspicious links.\n"
    "4. Notify Your Bank: Immediately request a temporary freeze on compromised cards or accounts.\n\n"
    "C. Relevant Indian Legal Framework\n"
    "- Information Technology Act, 2000: Section 66 (Hacking), Section 66C (Identity Theft), Section 66D (Cheating by Impersonation), Section 67 (Obscene content).\n"
    "- Bharatiya Nyaya Sanhita, 2023: Section 318 (Cheating), Section 319 (Cheating by personation).\n\n"
    "*(Notice: AI live provider is currently unavailable or unconfigured. Please refer to official government channels above.)*"
)

class LegalRouter:
    def __init__(
        self,
        searcher: Optional[LegalSearcher] = None,
        summary_provider: Optional[GeminiProvider] = None,
        fallback_provider: Optional[GeminiProvider] = None,
    ):
        self.searcher = searcher
        self.summary_provider = summary_provider
        self.fallback_provider = fallback_provider
        self._init_components()

    def _init_components(self) -> None:
        if self.searcher is None:
            try:
                self.searcher = LegalSearcher(
                    db_path=settings.CYBERSAATHI_INDEX_PATH,
                    min_score=settings.RETRIEVAL_MIN_SCORE,
                )
            except Exception as e:
                logger.warning(f"Searcher initialization deferred: {e}")
                self.searcher = None

        # Determine summarizer key
        summarizer_key = settings.LEGAL_SUMMARY_API_KEY or settings.GEMINI_API_KEY
        if self.summary_provider is None and summarizer_key:
            self.summary_provider = GeminiProvider(
                api_key=summarizer_key,
                model=settings.LEGAL_SUMMARY_MODEL or settings.GEMINI_MODEL,
            )

        # Fallback provider key
        if self.fallback_provider is None and settings.GEMINI_API_KEY:
            self.fallback_provider = GeminiProvider(
                api_key=settings.GEMINI_API_KEY,
                model=settings.GEMINI_MODEL,
            )

    def route_query(self, message: str, language: str = "en") -> Dict[str, Any]:
        """Execute the dataset-first answer flow."""
        clean_msg = message.strip()
        if not clean_msg:
            return {
                "answer": "Please describe your cyber legal concern or question.",
                "answer_source": "system",
                "dataset_match": False,
                "sources": [],
                "disclaimer": DISCLAIMER_TE if language == "te" else DISCLAIMER_EN,
            }

        # Step 1: Search local index
        search_res = {"matches": [], "is_sufficient": False, "top_score": 0.0}
        if self.searcher is not None:
            try:
                search_res = self.searcher.search(
                    clean_msg,
                    top_k=settings.RETRIEVAL_TOP_K,
                    min_score=settings.RETRIEVAL_MIN_SCORE,
                )
            except Exception as e:
                logger.error(f"Search error: {e}")

        is_match = search_res.get("is_sufficient", False)
        matches = search_res.get("matches", [])
        top_score = search_res.get("top_score", 0.0)

        # Step 2: If sufficiently relevant passages are found, summarize through summary provider
        if is_match and matches:
            if self.summary_provider and self.summary_provider.is_configured():
                try:
                    summary_text = self.summary_provider.summarize(
                        query=clean_msg,
                        passages=matches,
                        language=language,
                    )
                    sources = [
                        {
                            "doc_id": m["doc_id"],
                            "title": m["title"],
                            "document_type": m["document_type"],
                            "jurisdiction": m["jurisdiction"],
                            "issue_date": m["issue_date"],
                        }
                        for m in matches
                    ]
                    return {
                        "answer": summary_text,
                        "answer_source": "dataset_summary",
                        "dataset_match": True,
                        "sources": sources,
                        "top_score": top_score,
                        "disclaimer": DISCLAIMER_TE if language == "te" else DISCLAIMER_EN,
                    }
                except Exception as e:
                    logger.error(f"Summary provider failed: {e}")
                    # If summarizer fails, try fallback provider or offline guidance
            else:
                logger.info("Dataset matched but summary provider key missing. Falling back to structured passages.")
                # Grounded passage presentation if model provider is unconfigured
                primary = matches[0]
                answer = (
                    f"**Relevant Indian Legal Provision Identified in Dataset:**\n\n"
                    f"**{primary['title']}** ({primary['document_type']} - {primary['jurisdiction']})\n\n"
                    f"> {primary['text'][:800]}...\n\n"
                    f"*(Configure `LEGAL_SUMMARY_API_KEY` or `GEMINI_API_KEY` in `.env` to enable full synthesis.)*"
                )
                return {
                    "answer": answer,
                    "answer_source": "dataset_summary",
                    "dataset_match": True,
                    "sources": [
                        {
                            "doc_id": m["doc_id"],
                            "title": m["title"],
                            "document_type": m["document_type"],
                            "jurisdiction": m["jurisdiction"],
                            "issue_date": m["issue_date"],
                        }
                        for m in matches
                    ],
                    "top_score": top_score,
                    "disclaimer": DISCLAIMER_TE if language == "te" else DISCLAIMER_EN,
                }

        # Step 3: No sufficiently relevant match exists -> Gemini fallback
        if self.fallback_provider and self.fallback_provider.is_configured():
            try:
                fallback_text = self.fallback_provider.generate_fallback(
                    query=clean_msg,
                    language=language,
                )
                return {
                    "answer": fallback_text,
                    "answer_source": "gemini_fallback",
                    "dataset_match": False,
                    "sources": [],
                    "top_score": top_score,
                    "fallback_notice": (
                        "గమనిక: స్థానిక డేటాసెట్‌లో తగినంత నిర్దిష్ట చట్టం కనుగొనబడలేదు. ఇది సాధారణ AI మార్గదర్శకత్వం."
                        if language == "te" else
                        "Notice: No sufficiently relevant statutory provision was found in the local legal dataset. "
                        "This answer is provided via general AI guidance as a fallback."
                    ),
                    "disclaimer": DISCLAIMER_TE if language == "te" else DISCLAIMER_EN,
                }
            except Exception as e:
                logger.error(f"Fallback provider failed: {e}")

        # Step 4: If both providers fail or keys missing, return verified emergency guidance
        return {
            "answer": OFFLINE_FALLBACK_GUIDANCE,
            "answer_source": "emergency_offline",
            "dataset_match": False,
            "sources": [],
            "top_score": top_score,
            "fallback_notice": "Offline Guidance: External AI provider is currently unreachable or unconfigured.",
            "disclaimer": DISCLAIMER_TE if language == "te" else DISCLAIMER_EN,
        }
