param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)
$ErrorActionPreference = "Stop"
$script = Join-Path $PSScriptRoot "run_ghstack.py"
& uv run --python 3.11 $script @Arguments
