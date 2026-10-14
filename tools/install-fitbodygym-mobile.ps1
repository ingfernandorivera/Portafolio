$ErrorActionPreference = 'Stop'
$portfolioRoot = Split-Path -Parent $PSScriptRoot
$mobileBuild = Join-Path $portfolioRoot 'fitbodygym-demo-src/mobile/build/web'
$mobileTarget = Join-Path $portfolioRoot 'public/demos/apps/fitbodygym/mobile'
if (-not (Test-Path -LiteralPath (Join-Path $mobileBuild 'main.dart.js'))) { throw 'Falta una compilación web válida.' }
if (-not (Test-Path -LiteralPath (Join-Path $mobileBuild 'flutter_bootstrap.js'))) { throw 'Falta el cargador de Flutter.' }
# Flutter valida una base absoluta al compilar; la demo se instala en una subcarpeta portable.
$buildIndex = Join-Path $mobileBuild 'index.html'
$indexText = [IO.File]::ReadAllText($buildIndex).Replace('<base href="/">','<base href="./">')
if (-not $indexText.Contains('<base href="./">')) { throw 'No se pudo preparar la ruta relativa de la demo.' }
[IO.File]::WriteAllText($buildIndex,$indexText,[Text.UTF8Encoding]::new($false))
Get-ChildItem -LiteralPath $mobileBuild | Where-Object Name -ne 'index.html' | Copy-Item -Destination $mobileTarget -Recurse -Force
Copy-Item -LiteralPath $buildIndex -Destination (Join-Path $mobileTarget 'app.html') -Force
$demoShell = Join-Path $portfolioRoot 'fitbodygym-demo-src/mobile/demo-shell'
foreach ($shellFile in @('index.html','demo.css','demo.js')) {
    Copy-Item -LiteralPath (Join-Path $demoShell $shellFile) -Destination (Join-Path $mobileTarget $shellFile) -Force
}
$catalog = Join-Path $portfolioRoot 'public/assets/projects.js'
$catalogText = [IO.File]::ReadAllText($catalog).Replace('2 DEMOS DISPONIBLES','3 DEMOS DISPONIBLES').Replace('App de miembros (pendiente de compilación)','App de miembros')
[IO.File]::WriteAllText($catalog,$catalogText,[Text.UTF8Encoding]::new($false))
$case = Join-Path $portfolioRoot 'public/projects/fitbodygym/index.html'
$caseText = [IO.File]::ReadAllText($case).Replace('ESTADO DE LA APP MÓVIL','ABRIR DEMO MÓVIL ↗').Replace('App Flutter original: adaptación local preparada; compilación web pendiente.','App Flutter original con datos ficticios locales.')
[IO.File]::WriteAllText($case,$caseText,[Text.UTF8Encoding]::new($false))
