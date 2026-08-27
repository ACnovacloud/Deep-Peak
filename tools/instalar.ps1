# Instala la extensión copiando los archivos directamente a la carpeta de
# extensiones de VS Code (sin necesidad de Node.js ni .vsix).
#
# Uso:
#   .\instalar.ps1            # VS Code estable
#   .\instalar.ps1 -Insiders  # VS Code Insiders
#
# También puedes hacer doble clic en tools\instalar.bat

param(
  [switch]$Insiders  # Instala en VS Code Insiders
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot

# Datos de la extensión (se leen del package.json para no duplicarlos)
$pkg     = Get-Content (Join-Path $root 'package.json') -Raw | ConvertFrom-Json
$extId   = "$($pkg.publisher).$($pkg.name)"
$version = $pkg.version

# Carpeta destino de extensiones de VS Code
$extDir = Join-Path $HOME $(if ($Insiders) { '.vscode-insiders' } else { '.vscode' })
$extDir = Join-Path $extDir 'extensions'

# Nombre de carpeta estándar: <publisher>.<name>-<version>
$dest = Join-Path $extDir "$extId-$version"

Write-Host "Extensión: $extId@$version" -ForegroundColor Cyan
Write-Host "Destino:   $dest"

# Eliminar versiones anteriores de esta extensión
if (Test-Path $extDir) {
  Get-ChildItem $extDir -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "$extId-*" } |
    ForEach-Object {
      Write-Host "Eliminando versión anterior: $($_.Name)"
      Remove-Item -Recurse -Force $_.FullName
    }
}

# Crear la carpeta y copiar los archivos
New-Item -ItemType Directory -Path $dest -Force | Out-Null
Copy-Item (Join-Path $root 'extension.js') $dest
Copy-Item (Join-Path $root 'pricing.js')   $dest
Copy-Item (Join-Path $root 'package.json') $dest
Copy-Item (Join-Path $root 'README.md')    $dest
Copy-Item (Join-Path $root 'CHANGELOG.md') $dest
if (Test-Path (Join-Path $root 'LICENSE')) { Copy-Item (Join-Path $root 'LICENSE') $dest }

Write-Host ''
Write-Host 'OK - Instalada.' -ForegroundColor Green
Write-Host 'Recarga VS Code (Ctrl+Shift+P -> "Developer: Reload Window") para aplicarla.' -ForegroundColor Yellow
