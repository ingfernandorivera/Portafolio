@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Abre esta carpeta en VS Code y revisa README.md.
  pause
  exit /b 1
)
start "Servidor Portafolio 2026" /min node tools\serve.cjs
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173/"
