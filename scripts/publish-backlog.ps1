param()

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$backlogPath = Join-Path $projectRoot 'backlog.md'

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw 'GitHub CLI (gh) is required. Install it and run gh auth login first.'
}
if (-not (Test-Path -LiteralPath $backlogPath)) {
    throw "Backlog not found: $backlogPath"
}

Push-Location -LiteralPath $projectRoot
try {
    $repository = (& gh repo view --json nameWithOwner -q '.nameWithOwner').Trim()
    if ($LASTEXITCODE -ne 0 -or -not $repository) {
        throw 'No GitHub repository is connected to this directory.'
    }

    $visibility = (& gh repo view --json visibility -q '.visibility').Trim()
    if ($LASTEXITCODE -ne 0 -or $visibility -ne 'PUBLIC') {
        throw 'The course backlog must be published to a public repository.'
    }

    $backlogText = Get-Content -LiteralPath $backlogPath -Raw
    $pattern = '(?ms)^### (B-\d{2}) — ([^\r\n]+)\r?\n(.*?)(?=^### |^## |\z)'
    $tasks = [regex]::Matches($backlogText, $pattern)
    if ($tasks.Count -eq 0) {
        throw 'No B-xx task sections were found in backlog.md.'
    }

    $existing = @(& gh issue list --state all --limit 1000 --json title,url | ConvertFrom-Json)
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not list existing GitHub issues.'
    }

    $lines = @(Get-Content -LiteralPath $backlogPath)
    foreach ($task in $tasks) {
        $id = $task.Groups[1].Value
        $name = $task.Groups[2].Value.Trim()
        $title = "[$id] $name"
        $foundIssues = @($existing | Where-Object { $_.title -eq $title })
        if ($foundIssues.Count -gt 1) {
            throw "More than one issue matches $title; resolve duplicates before continuing."
        }

        if ($foundIssues.Count -eq 1) {
            $url = [string]$foundIssues[0].url
            Write-Host "Using existing issue: $title -> $url"
        }
        else {
            $body = "Source: https://github.com/$repository/blob/main/backlog.md`n`n" + $task.Groups[3].Value.Trim()
            $tempFile = New-TemporaryFile
            try {
                Set-Content -LiteralPath $tempFile.FullName -Value $body -Encoding utf8
                $url = (& gh issue create --title $title --body-file $tempFile.FullName).Trim()
                if ($LASTEXITCODE -ne 0 -or -not $url) {
                    throw "Failed to create issue $title"
                }
            }
            finally {
                Remove-Item -LiteralPath $tempFile.FullName -ErrorAction SilentlyContinue
            }
            $existing += [pscustomobject]@{ title = $title; url = $url }
            Write-Host "Created issue: $title -> $url"
        }

        $issueNumberMatch = [regex]::Match($url, '/issues/(\d+)$')
        if (-not $issueNumberMatch.Success) {
            throw "Unexpected issue URL: $url"
        }
        $number = $issueNumberMatch.Groups[1].Value
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i].StartsWith("| $id |")) {
                $lines[$i] = $lines[$i] -replace '\| (Not published|\[#\d+\]\([^)]*\)) \|$', "| [#$number]($url) |"
                break
            }
        }
    }

    Set-Content -LiteralPath $backlogPath -Value $lines -Encoding utf8
    Write-Host "Linked $($tasks.Count) backlog tasks in $backlogPath"
}
finally {
    Pop-Location
}
