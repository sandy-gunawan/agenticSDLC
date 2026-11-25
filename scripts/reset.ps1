Push-Location (Join-Path $PSScriptRoot '..')
try { node scripts/demo.mjs reset }
finally { Pop-Location }
