@echo off
title CyberSaathi - All-In-One Control Panel
color 0b

cd /d "%~dp0"

:MENU
cls
echo ======================================================================
echo             CYBERSAATHI - AI CYBER LEGAL GUIDANCE PLATFORM
echo                     All-In-One Control Center
echo ======================================================================
echo.
echo   [1] Start CyberSaathi Website (Launch Server ^& Open Browser)
echo   [2] Run Automated Test Suite (17 Tests)
echo   [3] Inspect Search Index Health ^& Status
echo   [4] Build / Re-index Local Legal Documents Database
echo   [5] Download Published HuggingFace Dataset
echo   [6] Build Frontend Production Bundle (Vite + React)
echo   [7] Full Automated Setup (Check Dependencies, Index, ^& Launch)
echo   [8] Open Public GitHub Repository in Browser
echo   [0] Exit
echo.
echo ======================================================================
set /p choice="Enter choice [1-8, 0] (Default is 1): "

if "%choice%"=="" goto START_APP
if "%choice%"=="1" goto START_APP
if "%choice%"=="2" goto RUN_TESTS
if "%choice%"=="3" goto CHECK_STATUS
if "%choice%"=="4" goto BUILD_INDEX
if "%choice%"=="5" goto DOWNLOAD_DATA
if "%choice%"=="6" goto BUILD_FRONTEND
if "%choice%"=="7" goto FULL_SETUP
if "%choice%"=="8" goto OPEN_GITHUB
if "%choice%"=="0" exit /b 0

echo Invalid choice. Please try again.
timeout /t 2 >nul
goto MENU

:START_APP
cls
echo ======================================================================
echo                     Starting CyberSaathi Platform
echo ======================================================================
echo.
if not exist ".env" (
    echo [!] .env file not found. Creating from .env.example...
    copy ".env.example" ".env" >nul
)
if not exist "data\index\legal_documents.sqlite" (
    echo [!] Search index not found. Building index first...
    python scripts\build_index.py
)
echo [*] Opening browser to http://127.0.0.1:8000 ...
start http://127.0.0.1:8000
echo [*] Starting Uvicorn backend server...
echo [*] Press Ctrl+C in this window anytime to stop the server.
echo.
python -m uvicorn src.backend.main:app --host 127.0.0.1 --port 8000
goto PAUSE_AND_MENU

:RUN_TESTS
cls
echo ======================================================================
echo                   Running Automated Pytest Suite
echo ======================================================================
echo.
python -m pytest tests/ -v
goto PAUSE_AND_MENU

:CHECK_STATUS
cls
echo ======================================================================
echo                     Checking Index Health
echo ======================================================================
echo.
python scripts\index_status.py
goto PAUSE_AND_MENU

:BUILD_INDEX
cls
echo ======================================================================
echo               Building / Re-indexing SQLite Search Database
echo ======================================================================
echo.
python scripts\build_index.py
echo.
python scripts\index_status.py
goto PAUSE_AND_MENU

:DOWNLOAD_DATA
cls
echo ======================================================================
echo               Downloading KanoonGPT Legal Documents Dataset
echo ======================================================================
echo.
python scripts\download_dataset.py
goto PAUSE_AND_MENU

:BUILD_FRONTEND
cls
echo ======================================================================
echo                 Building Frontend Production Bundle
echo ======================================================================
echo.
cd frontend
call npm.cmd run build
cd ..
goto PAUSE_AND_MENU

:FULL_SETUP
cls
echo ======================================================================
echo                     Full Project Verification ^& Setup
echo ======================================================================
echo.
echo [*] Installing / verifying Python requirements...
python -m pip install -r requirements.txt
if not exist "data\raw\kanoongpt_indian_legal_documents\data\train-00000.parquet" (
    echo [*] Downloading dataset...
    python scripts\download_dataset.py
)
if not exist "data\index\legal_documents.sqlite" (
    echo [*] Building SQLite index...
    python scripts\build_index.py
)
echo [*] Running test verification...
python -m pytest tests/ -v
echo [*] Launching CyberSaathi...
start http://127.0.0.1:8000
python -m uvicorn src.backend.main:app --host 127.0.0.1 --port 8000
goto PAUSE_AND_MENU

:OPEN_GITHUB
echo [*] Opening GitHub repository...
start https://github.com/yogiraj-77/CyberSaathi
goto MENU

:PAUSE_AND_MENU
echo.
echo ======================================================================
pause
goto MENU
