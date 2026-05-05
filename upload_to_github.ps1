param(
    [string]$RemoteUrl = 'https://github.com/hashmimustaqeem76-pixel/Zameendar.git'
)

Write-Host "Uploading project to GitHub remote: $RemoteUrl"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed or not available in PATH. Install Git from https://git-scm.com/downloads and try again."
    exit 1
}

Set-Location -Path $PSScriptRoot

if (-not (Test-Path .git)) {
    git init
    Write-Host "Initialized local Git repository."
} else {
    Write-Host ".git repository already exists."
}

git remote remove origin 2>$null | Out-Null

git remote add origin $RemoteUrl

# Ensure a main branch exists and is checked out
if (-not (git branch --list main)) {
    git branch -M main
} else {
    git checkout main
}

git add .

$commitMessage = 'Initial commit'
if (git commit -m "$commitMessage" 2>$null) {
    Write-Host "Created commit: $commitMessage"
} else {
    Write-Host "No new changes to commit or commit already exists."
}

git push -u origin main
