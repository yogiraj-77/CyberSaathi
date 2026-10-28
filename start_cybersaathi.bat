@echo off
title CyberSaathi - AI Cyber Legal Guidance Platform
color 0b

echo ======================================================================
echo                CyberSaathi - AI Cyber Legal Assistant
echo            Dataset-First Indian Legal Guidance Platform
echo ======================================================================
echo.

:: Change to the directory of this batch file
cd /d "%~dp0"

:: 1. Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ and add it to your system PATH.
    pause
    exit /b 1
)

:: 2. Check .env configuration
if not exist ".env" (
    echo [!] .env file not found. Creating from .env.example...
    copy ".env.example" ".env" >nul
    echo [i] Created .env. Please configure your GEMINI_API_KEY if needed.
    echo.
)

:: 3. Check SQLite Search Index
if not exist "data\index\legal_documents.sqlite" (
    echo [!] Search index not found at data\index\legal_documents.sqlite.
    echo [i] Running scripts\build_index.py to create the local index...
    python scripts\build_index.py
    if errorlevel 1 (
        echo [ERROR] Failed to build search index!
        pause
        exit /b 1
    )
)

:: 4. Launch Browser
echo [*] Launching CyberSaathi in your browser...
start http://127.0.0.1:8000

:: 5. Start Uvicorn Server
echo [*] Starting CyberSaathi Backend Server on http://127.0.0.1:8000 ...
echo [*] Press Ctrl+C in this window anytime to stop the server.
echo.
python -m uvicorn src.backend.main:app --host 127.0.0.1 --port 8000

pause
