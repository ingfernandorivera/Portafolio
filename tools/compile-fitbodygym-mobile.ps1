$ErrorActionPreference = 'Stop'
$portfolioRoot = Split-Path -Parent $PSScriptRoot
$mobileSource = Join-Path $portfolioRoot 'fitbodygym-demo-src/mobile'
$buildLog = Join-Path $portfolioRoot 'fitbodygym-build.log'
$flutterCommand = 'C:\Users\Krivera\dev\flutter\bin\flutter.bat'
if (-not (Test-Path -LiteralPath $flutterCommand)) {
    $flutterCommand = (Get-Command flutter -ErrorAction Stop).Source
}

function Invoke-FlutterStep {
    param([string[]]$StepArguments)
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        & $flutterCommand @StepArguments *>> $buildLog
    } finally {
        $ErrorActionPreference = $prev
    }
    if ($LASTEXITCODE -ne 0) {
        throw "Flutter terminó con código $LASTEXITCODE. El detalle está en $buildLog"
    }
}

Set-Content -LiteralPath $buildLog -Value "FitBodyGym: compilación de la app original en modo demo. $(Get-Date -Format s)" -Encoding UTF8
Push-Location -LiteralPath $mobileSource
try {
    Invoke-FlutterStep -StepArguments @('pub', 'get')
    Invoke-FlutterStep -StepArguments @('build', 'web', '--release', '--base-href', '/', '--dart-define=PREVIEW_MODE=true', '--no-web-resources-cdn', '--no-wasm-dry-run', '--no-tree-shake-icons')
    & (Join-Path $PSScriptRoot 'install-fitbodygym-mobile.ps1')
    Write-Host 'App original compilada e instalada. Recarga la página de miembros en el portafolio.' -ForegroundColor Green
} catch {
    $_ | Out-String | Add-Content -LiteralPath $buildLog -Encoding UTF8
    Write-Host $_ -ForegroundColor Red
    Write-Host "Registro: $buildLog"
    exit 1
} finally {
    Pop-Location
}
