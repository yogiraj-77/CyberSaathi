"""Tests for the dataset-first routing workflow, fallback mechanism, and edge cases."""
import pytest
from unittest.mock import MagicMock
from src.backend.routing import LegalRouter
from src.backend.providers.gemini_provider import GeminiProvider

def test_routing_empty_input():
    router = LegalRouter()
    res = router.route_query("")
    assert res["dataset_match"] is False
    assert "Please describe" in res["answer"]
    assert "disclaimer" in res

def test_routing_dataset_match_with_mock_summary():
    mock_summary_provider = MagicMock(spec=GeminiProvider)
    mock_summary_provider.is_configured.return_value = True
    mock_summary_provider.summarize.return_value = (
        "A. Understanding Your Situation\n"
        "Your account credentials were stolen.\n"
        "B. Immediate Actions\n"
        "Call 1930.\n"
        "C. Potentially Applicable Indian Laws\n"
        "Section 66C IT Act."
    )

    router = LegalRouter(summary_provider=mock_summary_provider)
    res = router.route_query("Identity theft using computer password and electronic signature", language="en")
    
    assert res["dataset_match"] is True
    assert res["answer_source"] == "dataset_summary"
    assert len(res["sources"]) > 0
    assert "Section 66C" in res["answer"]
    assert "doc_id" in res["sources"][0]
    assert "title" in res["sources"][0]
    mock_summary_provider.summarize.assert_called_once()

def test_routing_fallback_for_unrelated_query():
    mock_fallback_provider = MagicMock(spec=GeminiProvider)
    mock_fallback_provider.is_configured.return_value = True
    mock_fallback_provider.generate_fallback.return_value = "General advice for unrelated query."

    router = LegalRouter(fallback_provider=mock_fallback_provider)
    res = router.route_query("How to make chocolate cake at home?", language="en")

    assert res["dataset_match"] is False
    assert res["answer_source"] == "gemini_fallback"
    assert "No sufficiently relevant statutory provision was found" in res["fallback_notice"]
    assert len(res["sources"]) == 0
    mock_fallback_provider.generate_fallback.assert_called_once()

def test_routing_missing_keys_graceful_offline_response():
    # Router with unconfigured providers must return useful offline 1930 / cybercrime.gov.in guidance
    router = LegalRouter(
        summary_provider=GeminiProvider(api_key=""),
        fallback_provider=GeminiProvider(api_key=""),
    )
    res = router.route_query("What is the recipe for chocolate cake?", language="en")
    assert res["dataset_match"] is False
    assert "1930" in res["answer"]
    assert "https://cybercrime.gov.in/" in res["answer"]

def test_routing_telugu_language_disclaimer():
    router = LegalRouter()
    res = router.route_query("నన్ను ఒకరు మోసం చేశారు", language="te")
    assert "సైబర్‌సాథీ" in res["disclaimer"]
