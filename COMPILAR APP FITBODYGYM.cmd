@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\compile-fitbodygym-mobile.ps1"
if errorlevel 1 (
  echo La compilacion no termino. Revisa fitbodygym-build.log en esta carpeta.
)
pause