param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args
)
$ErrorActionPreference = "Stop"
$script = Join-Path $PSScriptRoot "run_ghstack.py"
python $script @Args
