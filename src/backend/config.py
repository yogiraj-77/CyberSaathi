"""Configuration and environment settings for CyberSaathi backend."""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env if present
ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")

class Settings:
    # Providers
    LEGAL_SUMMARY_PROVIDER: str = os.getenv("LEGAL_SUMMARY_PROVIDER", "gemini").lower()
    LEGAL_SUMMARY_API_KEY: str = os.getenv("LEGAL_SUMMARY_API_KEY", "")
    LEGAL_SUMMARY_BASE_URL: str = os.getenv("LEGAL_SUMMARY_BASE_URL", "")
    LEGAL_SUMMARY_MODEL: str = os.getenv("LEGAL_SUMMARY_MODEL", "gemini-2.5-flash")

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    # Index and retrieval
    CYBERSAATHI_DATA_DIR: str = os.getenv(
        "CYBERSAATHI_DATA_DIR",
        str(ROOT_DIR / "data" / "raw" / "kanoongpt_indian_legal_documents" / "data"),
    )
    CYBERSAATHI_INDEX_PATH: str = os.getenv(
        "CYBERSAATHI_INDEX_PATH",
        str(ROOT_DIR / "data" / "index" / "legal_documents.sqlite"),
    )
    RETRIEVAL_TOP_K: int = int(os.getenv("RETRIEVAL_TOP_K", "5"))
    RETRIEVAL_MIN_SCORE: float = float(os.getenv("RETRIEVAL_MIN_SCORE", "3.5"))

    # Server
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
