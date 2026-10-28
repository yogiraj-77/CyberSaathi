"""Base interfaces for summarization and fallback providers."""
from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseSummaryProvider(ABC):
    @abstractmethod
    def summarize(
        self,
        query: str,
        passages: List[Dict[str, Any]],
        language: str = "en",
    ) -> str:
        """Summarize retrieved legal passages strictly grounded in their content."""
        pass

class BaseFallbackProvider(ABC):
    @abstractmethod
    def generate_fallback(
        self,
        query: str,
        language: str = "en",
    ) -> str:
        """Generate general informational legal guidance when no dataset match is found."""
        pass
