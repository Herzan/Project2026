@echo off
REM Double-click this file (or run start.bat) to install everything and start the whole app.
cd /d "%~dp0"
if not exist .env copy .env.example .env >nul
if not exist node_modules call npm install
if not exist client\node_modules call npm install --prefix client
echo.
echo Starting... when you see "VITE ready", open http://localhost:5173
echo Login: admin / admin123
echo.
call npm run dev:all
pause
