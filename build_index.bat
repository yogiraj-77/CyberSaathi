@echo off
title CyberSaathi - Build Search Index
color 0a

cd /d "%~dp0"
echo ======================================================================
echo           CyberSaathi - Local SQLite FTS5 Search Indexer
echo ======================================================================
echo.

python scripts\build_index.py
echo.
python scripts\index_status.py

pause
