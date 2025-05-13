@echo off
title Start Local Server and Open Browser

echo ===========================================
echo Starting Python HTTP server on port 8000...
echo ===========================================
echo Serving files from the current directory: %CD%
echo Make sure you run this script from your project's root folder!
echo.

rem Start the Python server in a new command prompt window.
rem This allows the current script to continue execution.
start "Python HTTP Server" cmd /c "python -m http.server 8000"

echo Waiting for server to start (approx. 3 seconds)...
rem Pause execution for 3 seconds to give the server time to initialize.
rem /nobreak prevents interruption by keypress. "> nul" hides the countdown message.
timeout /t 3 /nobreak > nul

echo ===========================================
echo Opening http://localhost:8000 in browser...
echo ===========================================
rem Use start command to open the URL in the default browser.
start http://localhost:8000/src/index.html

echo.
echo Server is running in a separate window named "Python HTTP Server".
echo To stop the server, switch to that window and press Ctrl+C, or simply close it.
echo This script window can be closed.
echo.

rem Optional: Uncomment the next line if you want this window to wait for a key press before closing.
rem pause