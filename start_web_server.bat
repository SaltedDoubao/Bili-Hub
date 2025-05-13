@echo off
title Start Local Server and Open Browser

echo ===========================================
echo Starting Python HTTP server on port 8000...
echo ===========================================
echo Serving files from the current directory: %CD%
echo Make sure you run this script from your project's root folder!
echo.

start "Python HTTP Server" cmd /c "python -m http.server 8000"

echo Waiting for server to start (approx. 3 seconds)...

timeout /t 3 /nobreak > nul

echo ===========================================
echo Opening http://localhost:8000 in browser...
echo ===========================================
start http://localhost:8000/src/index.html

echo.
echo Server is running in a separate window named "Python HTTP Server".
echo To stop the server, switch to that window and press Ctrl+C, or simply close it.
echo This script window can be closed.
echo.
