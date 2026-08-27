# Desinstala la extensión DeepSeek Peak Indicator localmente.
#
# Uso:
#   .\desinstalar.ps1            # VS Code estable
#   .\desinstalar.ps1 -Insiders  # VS Code Insiders

param(
  [switch]$Insiders
)

$ErrorActionPreference = 'Stop'

$root  = Split-Path -Parent $PSScriptRoot
$pkg   = Get-Content (Join-Path $root 'package.json') -Raw | ConvertFrom-Json
$extId = "$($pkg.publisher).$($pkg.name)"

$cliName = if ($Insiders) { 'code-insiders' } else { 'code' }
$extDir  = Join-Path $HOME $(if ($Insiders) { '.vscode-insiders' } else { '.vscode' })
$extDir  = Join-Path $extDir 'extensions'

Write-Host "Desinstalando $extId ..." -ForegroundColor Cyan

# 1) Si estaba instalada con la CLI (como .vsix), desinstalar formalmente
$cli = Get-Command $cliName -ErrorAction SilentlyContinue
if ($cli) {
  & $cli.Source --uninstall-extension $extId 2>$null
  Write-Host "  CLI $cliName: hecho." -ForegroundColor DarkGray
}

# 2) Eliminar cualquier copia directa en la carpeta de extensiones
if (Test-Path $extDir) {
  Get-ChildItem $extDir -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "$extId-*" } |
    ForEach-Object {
      Write-Host "Eliminando carpeta: $($_.FullName)"
      Remove-Item -Recurse -Force $_.FullName
    }
}

Write-Host ''
Write-Host 'OK - Extensión desinstalada.' -ForegroundColor Green
Write-Host 'Recarga VS Code (Ctrl+Shift+P -> "Developer: Reload Window") para aplicar el cambio.' -ForegroundColor Yellow
