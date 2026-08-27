@echo off
rem Instalador local de la extensión (doble clic aquí).
rem Opciones: -ModoCopia  -Insiders
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0instalar.ps1" %*
endlocal
echo.
pause
