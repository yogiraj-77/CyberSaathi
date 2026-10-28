@echo off
title CyberSaathi - Run Test Suite
color 0e

cd /d "%~dp0"
echo ======================================================================
echo                   CyberSaathi - Automated Test Suite
echo ======================================================================
echo.

python -m pytest tests/ -v

echo.
pause
