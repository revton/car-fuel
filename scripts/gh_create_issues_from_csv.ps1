#Requires -Version 5.1
# Wrapper: delega execução para gh_create_issues_from_csv_v3.ps1
# Uso idêntico ao v3; este arquivo existe como atalho (entrypoint estável).

param([Parameter(ValueFromRemainingArguments=$true)][string[]]$Rest)

$ErrorActionPreference = 'Stop'
$target = Join-Path $PSScriptRoot 'gh_create_issues_from_csv_v3.ps1'
if (-not (Test-Path -LiteralPath $target)) { Write-Error 'Script alvo (v3) não encontrado.'; exit 2 }
& $target @Rest
