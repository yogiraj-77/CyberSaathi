"""FastAPI application for CyberSaathi legal assistant backend."""
import logging
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from src.backend.config import settings
from src.backend.routing import LegalRouter
from src.indexer.index_builder import IndexBuilder

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("cybersaathi.api")

app = FastAPI(
    title="CyberSaathi AI Legal Assistant API",
    description="Educational Indian cyber legal guidance assistant with dataset-first local retrieval and Gemini fallback.",
    version="1.0.0",
)

# Enable CORS for local development and frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router_instance: Optional[LegalRouter] = None

def get_router() -> LegalRouter:
    global router_instance
    if router_instance is None:
        router_instance = LegalRouter()
    return router_instance

# Pydantic models
class ChatRequest(BaseModel):
    message: str = Field(..., description="User query or cybercrime incident description")
    language: str = Field(default="en", description="Language code: 'en' or 'te'")

class SourceMetadata(BaseModel):
    doc_id: str
    title: str
    document_type: Optional[str] = None
    jurisdiction: Optional[str] = None
    issue_date: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    answer_source: str  # "dataset_summary" | "gemini_fallback" | "emergency_offline" | "system"
    dataset_match: bool
    sources: List[SourceMetadata] = []
    top_score: float = 0.0
    fallback_notice: Optional[str] = None
    disclaimer: str

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "CyberSaathi Backend"}

@app.get("/api/status")
def get_system_status():
    db_path = Path(settings.CYBERSAATHI_INDEX_PATH)
    index_exists = db_path.exists()
    stats = {}
    if index_exists:
        builder = IndexBuilder(db_path=db_path)
        stats = builder.get_stats()
        builder.close()

    has_gemini_key = bool(settings.GEMINI_API_KEY)
    has_summary_key = bool(settings.LEGAL_SUMMARY_API_KEY or settings.GEMINI_API_KEY)

    return {
        "index_ready": index_exists and stats.get("documents_indexed", 0) > 0,
        "index_stats": stats,
        "providers": {
            "summary_provider": settings.LEGAL_SUMMARY_PROVIDER,
            "summary_key_configured": has_summary_key,
            "fallback_key_configured": has_gemini_key,
        },
        "retrieval_settings": {
            "top_k": settings.RETRIEVAL_TOP_K,
            "min_score": settings.RETRIEVAL_MIN_SCORE,
        },
    }

@app.post("/api/chat", response_model=ChatResponse)
def handle_chat(payload: ChatRequest):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")
    
    router = get_router()
    response = router.route_query(
        message=payload.message,
        language=payload.language,
    )
    return response

# Curated Cyber Laws Endpoint (matching Page 3 of UI Mockup)
@app.get("/api/laws")
def get_cyber_laws():
    return [
        {
            "id": "it-sec-66",
            "section": "Section 66",
            "act": "IT Act, 2000",
            "category": "Information Technology Act",
            "title": "Computer Related Offences",
            "description": "Deals with hacking, unauthorized access, altering or destroying computer data with intent to cause damage.",
            "penalty": "Imprisonment up to 3 years or fine up to ₹5 lakh, or both.",
            "bailable": "Bailable / Cognizable",
        },
        {
            "id": "it-sec-66c",
            "section": "Section 66C",
            "act": "IT Act, 2000",
            "category": "Information Technology Act",
            "title": "Identity Theft",
            "description": "Punishment for identity theft, fraudulent use of electronic signature, password, or any unique identification feature.",
            "penalty": "Imprisonment up to 3 years and fine up to ₹1 lakh.",
            "bailable": "Bailable / Cognizable",
        },
        {
            "id": "it-sec-66d",
            "section": "Section 66D",
            "act": "IT Act, 2000",
            "category": "Information Technology Act",
            "title": "Cheating by Personation Using Computer Resource",
            "description": "Deals with online fraud, impersonation, phishing, fake profiles, and deceiving someone by pretending to be another entity.",
            "penalty": "Imprisonment up to 3 years and fine up to ₹1 lakh.",
            "bailable": "Cognizable",
        },
        {
            "id": "it-sec-67",
            "section": "Section 67",
            "act": "IT Act, 2000",
            "category": "Information Technology Act",
            "title": "Publishing Obscene Material",
            "description": "Punishment for publishing, transmitting, or causing to be published in electronic form any obscene or sexually explicit material.",
            "penalty": "First conviction: up to 3 years + ₹5 lakh. Second conviction: up to 5 years + ₹10 lakh.",
            "bailable": "Non-bailable on second conviction",
        },
        {
            "id": "bns-sec-318",
            "section": "BNS Section 318",
            "act": "Bharatiya Nyaya Sanhita, 2023",
            "category": "Bharatiya Nyaya Sanhita",
            "title": "Cheating and Dishonestly Inducing Delivery of Property",
            "description": "Corresponding to erstwhile IPC 420; applies to financial cyber frauds involving fraudulent transfer of money or property.",
            "penalty": "Imprisonment up to 7 years and fine.",
            "bailable": "Cognizable / Non-bailable",
        },
        {
            "id": "bns-sec-319",
            "section": "BNS Section 319",
            "act": "Bharatiya Nyaya Sanhita, 2023",
            "category": "Bharatiya Nyaya Sanhita",
            "title": "Cheating by Personation",
            "description": "Applies when someone pretends to be someone else or substitutes one person for another to deceive and cheat.",
            "penalty": "Imprisonment up to 5 years, or fine, or both.",
            "bailable": "Cognizable / Bailable",
        },
        {
            "id": "dpdp-2023",
            "section": "DPDP Act, 2023",
            "act": "Digital Personal Data Protection Act, 2023",
            "category": "Privacy & Data Protection",
            "title": "Obligations of Data Fiduciaries & User Privacy",
            "description": "Governs lawful processing of digital personal data, rights of Data Principals, and duties to prevent security breaches.",
            "penalty": "Financial penalties up to ₹250 crore for significant security safeguards failure.",
            "bailable": "Civil / Regulatory Penalty",
        },
    ]

# Curated Awareness Guides (matching Page 5 of UI Mockup)
@app.get("/api/awareness")
def get_awareness_guides():
    return [
        {
            "id": "phishing",
            "title": "How to Recognize Phishing Attacks",
            "category": "Phishing",
            "summary": "Learn how to spot deceptive emails, fake SMS bank alerts, and urgent fraudulent payment links.",
            "tips": [
                "Check sender email address carefully for typos (e.g., sbi-support-alert.com instead of sbi.co.in).",
                "Banks never ask for OTP, PIN, or CVV over SMS, phone, or email.",
                "Hover over links before clicking to inspect destination domain.",
            ],
        },
        {
            "id": "upi-fraud",
            "title": "Stay Safe with UPI and QR Payments",
            "category": "Online Payments",
            "summary": "Crucial rules to prevent money deductions during everyday mobile payment transactions.",
            "tips": [
                "Golden Rule: You NEVER enter your UPI PIN to RECEIVE money. Entering PIN always deducts money.",
                "Do not scan QR codes sent by unknown buyers on OLX, Facebook Marketplace, or WhatsApp.",
                "Verify beneficiary name displayed in UPI app before confirming any payment.",
            ],
        },
        {
            "id": "social-security",
            "title": "Secure Your Social Media Accounts",
            "category": "Social Media",
            "summary": "Protect Instagram, WhatsApp, and Facebook accounts against hijacking and unauthorized impersonation.",
            "tips": [
                "Enable Two-Factor Authentication (2FA) using an Authenticator App rather than SMS.",
                "Never share 6-digit WhatsApp registration codes or password reset links with anyone.",
                "Review logged-in sessions periodically and revoke unrecognized devices.",
            ],
        },
        {
            "id": "passwords-2fa",
            "title": "Strong Passwords and 2FA Best Practices",
            "category": "Safe Practices",
            "summary": "Essential cyber hygiene steps to secure banking, email, and personal accounts.",
            "tips": [
                "Use distinct passwords for financial portals and primary email addresses.",
                "Avoid using birthdays, pet names, or consecutive numbers in passwords.",
                "Keep backup recovery codes stored safely offline.",
            ],
        },
        {
            "id": "job-loan-scams",
            "title": "Recognize Fake Job & Loan Scams",
            "category": "Phishing",
            "summary": "Common signs of fraudulent Telegram part-time tasks and unauthorized instant loan applications.",
            "tips": [
                "Legitimate employers never ask for registration fees or upfront security deposits.",
                "Avoid loan apps requiring unrestricted access to contact lists and photo galleries.",
                "Check RBI register of Non-Banking Financial Companies (NBFCs) before applying.",
            ],
        },
        {
            "id": "data-protection",
            "title": "Protect Your Personal Information",
            "category": "Privacy",
            "summary": "Tips to minimize your digital footprint and avoid identity theft.",
            "tips": [
                "Mask Aadhaar number (use VID or Masked Aadhaar) when submitting identity proofs.",
                "Do not post boarding passes, tickets, or sensitive identification documents on social media.",
                "Revoke unnecessary app permissions for microphone, contacts, and location.",
            ],
        },
    ]

# Serve frontend static assets if built
frontend_dist = Path(__file__).resolve().parents[2] / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="static")
