$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)

function Invoke-PortfolioGit {
    param([string[]]$GitArgs)
    $result = & git @GitArgs
    if ($LASTEXITCODE -ne 0) { throw "Git no pudo completar: $($GitArgs[0])" }
    return $result
}

$branch = Invoke-PortfolioGit -GitArgs @('branch', '--show-current')
if ($branch -ne 'main') { throw 'Ejecuta la publicación desde la rama main.' }
$pending = Invoke-PortfolioGit -GitArgs @('status', '--porcelain', '--', 'public')
if ($pending) { throw 'Confirma primero en Git los cambios de public/.' }

Invoke-PortfolioGit -GitArgs @('push', 'origin', 'main')
$publicTree = Invoke-PortfolioGit -GitArgs @('rev-parse', 'HEAD:public')
$sourceCommit = Invoke-PortfolioGit -GitArgs @('rev-parse', '--short', 'HEAD')
$remote = Invoke-PortfolioGit -GitArgs @('ls-remote', 'origin', 'refs/heads/gh-pages')
$commitArgs = @('commit-tree', $publicTree, '-m', "Publicar portafolio $sourceCommit")
if ($remote) {
    Invoke-PortfolioGit -GitArgs @('fetch', 'origin', 'gh-pages')
    $parent = Invoke-PortfolioGit -GitArgs @('rev-parse', 'FETCH_HEAD')
    $commitArgs += @('-p', $parent)
}
$deployment = Invoke-PortfolioGit -GitArgs $commitArgs
Invoke-PortfolioGit -GitArgs @('push', 'origin', "${deployment}:refs/heads/gh-pages")
Write-Host 'Publicación enviada: https://ingfernandorivera.github.io/Portafolio/'
