#Requires -Version 5.1
# GitHub CLI helper (v2): cria issues e labels a partir de docs/project/ISSUES.csv
# Uso:
#   .\scripts\gh_create_issues_from_csv_v2.ps1 -Owner revton -Repo car-fuel [-AddToProject -ProjectOwner revton -ProjectNumber 1] [-DryRun]

param(
  [Parameter(Mandatory=$true)][string]$Owner,
  [Parameter(Mandatory=$true)][string]$Repo,
  [string]$CsvPath = "docs/project/ISSUES.csv",
  [switch]$AddToProject,
  [string]$ProjectOwner,
  [int]$ProjectNumber,
  [switch]$DryRun,
  [int]$RequestDelayMs = 0
)

$ErrorActionPreference = 'Stop'

function Write-Info($m){ Write-Host $m -ForegroundColor Cyan }
function Write-Ok($m){ Write-Host $m -ForegroundColor Green }
function Write-Warn2($m){ Write-Warning $m }
function Write-Fail($m){ Write-Error $m }

try { gh --version | Out-Null } catch { Write-Fail "GitHub CLI (gh) não encontrado no PATH."; exit 2 }
try { gh auth status | Out-Null } catch { Write-Warn2 "gh não autenticado. Execute 'gh auth login'" }

$RepoSlug = "$Owner/$Repo"
if (-not (Test-Path -LiteralPath $CsvPath)) { Write-Fail "CSV não encontrado: $CsvPath"; exit 3 }
$rows = Import-Csv -LiteralPath $CsvPath
if (-not $rows) { Write-Warn2 "Nenhuma linha no CSV"; exit 0 }

$LabelColors = @{ 'type:docs'='1D76DB'; 'area:docs'='0E8A16'; 'status:done'='5319E7'; 'status:todo'='5319E7'; 'priority:P1'='B60205'; 'priority:P2'='D93F0B'; 'priority:P3'='FBCA04'; 'type:chore'='84B6EB'; 'area:repo'='C2E0C6' }

function Ensure-Label{ param([string]$Name)
  $color = $LabelColors[$Name]; if (-not $color){ $color='95A5A6' }
  if ($DryRun){ Write-Info "[dry-run] label: $Name ($color)"; return }
  try { gh label view $Name -R $RepoSlug 2>$null | Out-Null; Write-Info "Label existe: $Name" }
  catch { gh label create $Name --color $color -R $RepoSlug --force 2>$null | Out-Null; Write-Ok "Label ok: $Name" }
}

function Normalize-Title{ param([string]$s)
  if ($null -eq $s) { return '' }
  $t = $s.Trim()
  try { $t = $t.Normalize([Text.NormalizationForm]::FormKC) } catch {}
  $t = [regex]::Replace($t, "\s+", " ")
  return $t
}

function Canonical-Title{ param([string]$s)
  $n = Normalize-Title $s
  try { $d = $n.Normalize([Text.NormalizationForm]::FormD) } catch { $d = $n }
  $sb = New-Object System.Text.StringBuilder
  foreach ($ch in $d.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      if ([char]::IsLetterOrDigit($ch) -or [char]::IsWhiteSpace($ch)) { [void]$sb.Append([char]::ToLowerInvariant($ch)) }
      else { [void]$sb.Append(' ') }
    }
  }
  $canon = [regex]::Replace($sb.ToString(), '\s+', ' ').Trim()
  return $canon
}

function Build-OpenIssuesMaps {
  # Retorna hashes: títulos normalizados e canônicos -> número
  $norm = @{}
  $canon = @{}
  try {
    $page = 1
    while ($true) {
      $json = gh api -X GET "repos/$RepoSlug/issues" -f state=open -f per_page=100 -f page=$page
      if (-not $json) { break }
      $items = $json | ConvertFrom-Json
      if (-not $items -or $items.Count -eq 0) { break }
      foreach ($it in $items) {
        if ($it.PSObject.Properties.Name -contains 'pull_request') { continue }
        $n = Normalize-Title $it.title
        $c = Canonical-Title $it.title
        if ($n -and -not $norm.ContainsKey($n)) { $norm[$n] = [int]$it.number }
        if ($c -and -not $canon.ContainsKey($c)) { $canon[$c] = [int]$it.number }
      }
      if ($items.Count -lt 100) { break }
      $page++
    }
  } catch {
    Write-Warn2 "Falha ao listar issues abertas via gh api; prosseguindo sem cache."
  }
  return [PSCustomObject]@{ Norm = $norm; Canon = $canon }
}

function Escape-SearchPhrase{ param([string]$s)
  if ($null -eq $s) { return '' }
  $t = $s.Replace('\\', '\\\\')
  $t = $t.Replace('"', '\\"')
  return $t
}

function Search-OpenIssueByTitle {
  param([string]$Title)
  $phrase = Escape-SearchPhrase $Title
  $q = "repo:$RepoSlug is:issue is:open in:title `"$phrase`""
  try {
    $json = gh api -X GET search/issues -f q="$q" -f per_page=10
    if (-not $json) { return 0 }
    $obj = $json | ConvertFrom-Json
    if (-not $obj.items) { return 0 }
    $canonTitle = Canonical-Title $Title
    foreach ($it in $obj.items) {
      if ((Canonical-Title $it.title) -eq $canonTitle) { return [int]$it.number }
    }
    return 0
  } catch { return 0 }
}

if ($AddToProject -and ((-not $ProjectOwner) -or (-not $ProjectNumber))) { Write-Fail "Para -AddToProject, informe -ProjectOwner e -ProjectNumber."; exit 4 }

$created = New-Object System.Collections.ArrayList
$skipped = 0
$indexes = Build-OpenIssuesMaps
$openNorm = $indexes.Norm
$openCanon = $indexes.Canon

foreach ($row in $rows){
  $title = ($row.Title).Trim()
  $normTitle = Normalize-Title $title
  $canonTitle = Canonical-Title $title
  $body  = $row.Body
  $labels = @(); if ($row.Labels){ $labels = $row.Labels.Split(',') | % { $_.Trim() } | ? { $_ -ne '' } }

  # Se já possui Key no CSV, não busca duplicidade nem cria
  $existingKey = ''
  if ($row.PSObject.Properties.Name -contains 'Key') { $existingKey = [string]$row.Key }
  if ([string]::IsNullOrWhiteSpace($existingKey) -eq $false) {
    Write-Info "Pular (Key presente): #$existingKey $title"
    $skipped++; if ($RequestDelayMs -gt 0){ Start-Sleep -Milliseconds $RequestDelayMs }; continue
  }

  # Se marcado como status:done no CSV, não criar; apenas tentar vincular Key se existir
  $isDone = ($labels -contains 'status:done')
  if ($isDone) {
    $existingNum = 0
    if ($openNorm.ContainsKey($normTitle)) { $existingNum = [int]$openNorm[$normTitle] }
    elseif ($openCanon.ContainsKey($canonTitle)) { $existingNum = [int]$openCanon[$canonTitle] }
    if ($existingNum -eq 0) { $existingNum = Search-OpenIssueByTitle -Title $title }
    if ($existingNum -gt 0) {
      if (-not ($row.PSObject.Properties.Name -contains 'Key')) { $row | Add-Member -NotePropertyName Key -NotePropertyValue '' }
      $row.Key = "$existingNum"
      Write-Info "Pular (done): associada à existente #$existingNum $title"
    } else {
      Write-Info "Pular (done): nenhuma issue aberta encontrada para '$title'"
    }
    $skipped++; if ($RequestDelayMs -gt 0){ Start-Sleep -Milliseconds $RequestDelayMs }; continue
  }

  # Evita duplicar: tenta por caminho de documento no corpo, depois título (norm/canon) e busca por título
  $existingNum = 0
  try {
    $m = [regex]::Match($body, '(?i)docs/[A-Za-z0-9._/\-]+')
    if ($m.Success) {
      $pathQ = $m.Value
      $qPhrase = Escape-SearchPhrase $pathQ
      $q = "repo:$RepoSlug is:issue is:open in:body `"$qPhrase`""
      $j = gh api -X GET search/issues -f q="$q" -f per_page=10
      if ($j) {
        $obj = $j | ConvertFrom-Json
        if ($obj.items -and $obj.items.Count -gt 0) { $existingNum = [int]$obj.items[0].number }
      }
    }
  } catch {}
  if ($existingNum -eq 0 -and $openNorm.ContainsKey($normTitle)) { $existingNum = [int]$openNorm[$normTitle] }
  elseif ($existingNum -eq 0 -and $openCanon.ContainsKey($canonTitle)) { $existingNum = [int]$openCanon[$canonTitle] }
  if ($existingNum -eq 0) { $existingNum = Search-OpenIssueByTitle -Title $title }
  if ($existingNum -gt 0){
    if (-not ($row.PSObject.Properties.Name -contains 'Key')) { $row | Add-Member -NotePropertyName Key -NotePropertyValue '' }
    $row.Key = "$existingNum"
    Write-Info "Pular (já existe aberta): #$existingNum $title"
    $skipped++; if ($RequestDelayMs -gt 0){ Start-Sleep -Milliseconds $RequestDelayMs }; continue
  }

  foreach ($ln in $labels){ Ensure-Label -Name $ln }

  if ($DryRun){ Write-Info "[dry-run] criaria issue: $title"; continue }

  $fields = @("-f","title=$title","-f","body=$body"); foreach($l in $labels){ $fields += @("-f","labels[]=$l") }
  try{
    $json = gh api -X POST "repos/$RepoSlug/issues" @fields --jq '{number: .number, url: .html_url}'
    if (-not $json){ Write-Fail "Falha ao criar: $title"; continue }
    $issue = $json | ConvertFrom-Json
    [void]$created.Add([PSCustomObject]@{ number = $issue.number; url = $issue.url; title = $title })
    Write-Ok ("Criada: #{0} {1}" -f $issue.number, $issue.url)
    if (-not ($row.PSObject.Properties.Name -contains 'Key')) { $row | Add-Member -NotePropertyName Key -NotePropertyValue '' }
    $row.Key = "${($issue.number)}"
    # Atualiza caches para evitar duplicar na mesma execução
    $openNorm[$normTitle] = [int]$issue.number
    $openCanon[$canonTitle] = [int]$issue.number
    if ($AddToProject){ try { gh project item-add $ProjectNumber --owner $ProjectOwner --url $issue.url | Out-Null; Write-Info "Adicionada ao Project" } catch { Write-Warn2 "Falha ao adicionar ao Project" } }
  } catch { Write-Fail ("Erro via gh api: $title") }

  if ($RequestDelayMs -gt 0){ Start-Sleep -Milliseconds $RequestDelayMs }
}

Write-Host "----" -ForegroundColor DarkGray
Write-Host ("Total criadas: {0} | Puladas: {1}" -f $created.Count, $skipped) -ForegroundColor White
$created | % { Write-Host ("#{0} - {1} - {2}" -f $_.number, $_.url, $_.title) }

# Persistir CSV com coluna Key atualizada (ordem: Title, Body, Labels, Key)
try {
  $ordered = @()
  foreach ($r in $rows) {
    $title = $r.Title; $body = $r.Body; $labels = $r.Labels; $key = $r.PSObject.Properties['Key'].Value
    $obj = [PSCustomObject]@{ Title = $title; Body = $body; Labels = $labels; Key = $key }
    $ordered += $obj
  }
  $ordered | Export-Csv -Path $CsvPath -NoTypeInformation -Encoding UTF8
  Write-Ok "CSV atualizado com coluna Key: $CsvPath"
} catch {
  Write-Warn2 "Falha ao atualizar CSV com Key"
}
