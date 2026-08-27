@echo off
rem Desinstalador local de la extensión (doble clic aquí).
rem Opciones: -Insiders
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0desinstalar.ps1" %*
endlocal
echo.
pause
