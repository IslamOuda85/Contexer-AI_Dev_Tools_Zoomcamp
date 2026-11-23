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
    if ($LASTEXITCODE -ne 0 -or $visibility -notin @('PUBLIC', 'PRIVATE')) {
        throw 'Could not determine the GitHub repository visibility.'
    }
    if ($visibility -eq 'PRIVATE') {
        Write-Warning 'The repository is private. Issues can be created now, but peer reviewers cannot see them until the repository is public.'
    }
    $planUrl = "https://github.com/$repository/blob/main/project_plan.md"

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
            $body = "Source: https://github.com/$repository/blob/main/backlog.md`nPlan: $planUrl`n`n" + $task.Groups[3].Value.Trim()
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
        $currentBody = (& gh issue view $url --json body -q '.body') -join "`n"
        if ($LASTEXITCODE -ne 0) {
            throw "Could not read issue body for $title"
        }
        if (-not $currentBody.Contains($planUrl)) {
            $tempFile = New-TemporaryFile
            try {
                $updatedBody = "Plan: $planUrl`n`n" + $currentBody.Trim()
                Set-Content -LiteralPath $tempFile.FullName -Value $updatedBody -Encoding utf8
                & gh issue edit $url --body-file $tempFile.FullName | Out-Null
                if ($LASTEXITCODE -ne 0) {
                    throw "Could not add plan link to issue $title"
                }
            }
            finally {
                Remove-Item -LiteralPath $tempFile.FullName -ErrorAction SilentlyContinue
            }
            Write-Host "Linked plan in issue: $title"
        }
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
