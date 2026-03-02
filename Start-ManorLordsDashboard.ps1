<#
.SYNOPSIS
    Manor Lords Dashboard Launcher
.DESCRIPTION
    Handles environment validation, dependency management, and application startup
    for the Manor Lords MCP Dashboard.
.PARAMETER Dev
    Launch in dev mode with hot reload and DevTools open.
.PARAMETER SavePath
    Override Manor Lords save file directory.
.PARAMETER Port
    MCP server port (default: 3847).
.PARAMETER NoBrowser
    Suppress auto-opening DevTools in dev mode.
.PARAMETER Reset
    Clear cached data and reset to defaults.
#>

[CmdletBinding()]
param(
    [switch]$Dev,
    [string]$SavePath,
    [int]$Port = 3847,
    [switch]$NoBrowser,
    [switch]$Reset
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host ""
Write-Host "  ===========================================" -ForegroundColor DarkYellow
Write-Host "       MANOR LORDS DASHBOARD" -ForegroundColor Yellow
Write-Host "       Medieval Settlement Companion" -ForegroundColor DarkYellow
Write-Host "  ===========================================" -ForegroundColor DarkYellow
Write-Host ""

# --- Environment Check ---
Write-Host "[1/5] Checking environment..." -ForegroundColor Cyan

# Check Node.js
$nodeVersion = $null
try {
    $nodeVersion = (node --version 2>$null)
} catch {}

if (-not $nodeVersion) {
    Write-Host "  ERROR: Node.js is not installed." -ForegroundColor Red
    Write-Host "  Install Node.js 20+ via: winget install OpenJS.NodeJS.LTS" -ForegroundColor Yellow
    Write-Host "  Or download from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

$major = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($major -lt 20) {
    Write-Host "  WARNING: Node.js $nodeVersion detected. Version 20+ recommended." -ForegroundColor Yellow
} else {
    Write-Host "  Node.js $nodeVersion detected." -ForegroundColor Green
}

# Check npm
$npmVersion = npm --version 2>$null
Write-Host "  npm v$npmVersion detected." -ForegroundColor Green

# --- Reset ---
if ($Reset) {
    Write-Host "[*] Resetting cached data..." -ForegroundColor Yellow
    $distDirs = @("$ScriptDir\dist", "$ScriptDir\dist-electron", "$ScriptDir\dist-mcp")
    foreach ($d in $distDirs) {
        if (Test-Path $d) { Remove-Item -Recurse -Force $d }
    }
    Write-Host "  Cache cleared." -ForegroundColor Green
}

# --- Dependency Resolution ---
Write-Host "[2/5] Checking dependencies..." -ForegroundColor Cyan

Set-Location $ScriptDir

if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing dependencies (first run)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ERROR: npm install failed." -ForegroundColor Red
        exit 1
    }
} else {
    # Check if package-lock.json is newer than node_modules
    $lockTime = (Get-Item "package-lock.json" -ErrorAction SilentlyContinue)?.LastWriteTime
    $modulesTime = (Get-Item "node_modules" -ErrorAction SilentlyContinue)?.LastWriteTime
    if ($lockTime -and $modulesTime -and ($lockTime -gt $modulesTime)) {
        Write-Host "  Dependencies changed, updating..." -ForegroundColor Yellow
        npm install
    } else {
        Write-Host "  Dependencies up to date." -ForegroundColor Green
    }
}

# --- Process Cleanup ---
Write-Host "[3/5] Cleaning up stale processes..." -ForegroundColor Cyan

$staleProcesses = Get-Process -Name "electron", "manor-lords-dashboard" -ErrorAction SilentlyContinue
if ($staleProcesses) {
    Write-Host "  Stopping $($staleProcesses.Count) orphaned process(es)..." -ForegroundColor Yellow
    $staleProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "  No stale processes found." -ForegroundColor Green
}

# --- Configuration ---
Write-Host "[4/5] Loading configuration..." -ForegroundColor Cyan

$envFile = "$ScriptDir\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "  Creating .env file..." -ForegroundColor Yellow
    @"
# Manor Lords Dashboard Configuration
# Get your API key from https://console.anthropic.com
ANTHROPIC_API_KEY=your-api-key-here

# Manor Lords save file path (auto-detected if empty)
MANOR_LORDS_SAVE_PATH=

# MCP Server port
MCP_PORT=$Port
"@ | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "  .env created. Set your ANTHROPIC_API_KEY for AI features." -ForegroundColor Yellow
} else {
    Write-Host "  Configuration loaded." -ForegroundColor Green
}

# Load .env variables
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $key = $Matches[1].Trim()
        $val = $Matches[2].Trim()
        [Environment]::SetEnvironmentVariable($key, $val, "Process")
    }
}

# Auto-detect save path
if (-not $SavePath -and -not $env:MANOR_LORDS_SAVE_PATH) {
    $defaultSavePath = "$env:LOCALAPPDATA\ManorLords\save"
    if (Test-Path $defaultSavePath) {
        $env:MANOR_LORDS_SAVE_PATH = $defaultSavePath
        Write-Host "  Save directory detected: $defaultSavePath" -ForegroundColor Green
    } else {
        Write-Host "  Manor Lords save directory not found (manual entry mode)." -ForegroundColor Yellow
    }
} elseif ($SavePath) {
    $env:MANOR_LORDS_SAVE_PATH = $SavePath
}

# Game detection
Write-Host "[5/5] Checking for running game..." -ForegroundColor Cyan
$gameProcess = Get-Process -Name "ManorLords" -ErrorAction SilentlyContinue
if ($gameProcess) {
    Write-Host "  Manor Lords is running (PID: $($gameProcess.Id))." -ForegroundColor Green
} else {
    Write-Host "  Manor Lords not detected (dashboard works independently)." -ForegroundColor Yellow
}

# --- Launch ---
Write-Host ""
Write-Host "  Launching Dashboard..." -ForegroundColor Green
Write-Host ""

if ($Dev) {
    Write-Host "  Mode: Development (hot reload enabled)" -ForegroundColor Cyan
    $env:NODE_ENV = "development"
    if ($NoBrowser) {
        $env:ELECTRON_NO_DEVTOOLS = "1"
    }
    npm run electron:dev
} else {
    Write-Host "  Mode: Production" -ForegroundColor Cyan
    $env:NODE_ENV = "production"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ERROR: Build failed." -ForegroundColor Red
        exit 1
    }
    npx electron .
}
