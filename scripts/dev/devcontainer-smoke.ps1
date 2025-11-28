# Smoke test for Devcontainer environment
Write-Host "Checking Docker..."
docker --version
if ($LASTEXITCODE -ne 0) { Write-Error "Docker not found"; exit 1 }

Write-Host "Checking Compose profiles..."
docker compose config --profiles
if ($LASTEXITCODE -ne 0) { Write-Error "Docker Compose config failed"; exit 1 }

Write-Host "Smoke test passed!"
