# PowerShell script to create GitHub repository using environment credentials

$githubToken = $env:GITHUB_TOKEN
$githubUsername = $env:GITHUB_USERNAME
$repoName = "Oauth-Hub"
$repoDescription = "OAuth Hub - Complete OAuth2.1 backend with 37+ platforms support, deployed on Oracle Cloud with auto-deployment CI/CD"

if (-not $githubToken) {
    Write-Host "ERROR: GITHUB_TOKEN environment variable not found" -ForegroundColor Red
    exit 1
}

if (-not $githubUsername) {
    Write-Host "ERROR: GITHUB_USERNAME environment variable not found" -ForegroundColor Red
    exit 1
}

Write-Host "Creating GitHub repository: $repoName" -ForegroundColor Cyan
Write-Host "User: $githubUsername" -ForegroundColor Cyan
Write-Host "Description: $repoDescription" -ForegroundColor Cyan

# GitHub API payload
$body = @{
    name = $repoName
    description = $repoDescription
    private = $false
    has_issues = $true
    has_projects = $true
    has_wiki = $true
} | ConvertTo-Json

# GitHub API headers
$headers = @{
    "Authorization" = "token $githubToken"
    "Accept" = "application/vnd.github.v3+json"
    "Content-Type" = "application/json"
}

try {
    # Create repository
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Headers $headers -Body $body

    Write-Host "SUCCESS: Repository created successfully!" -ForegroundColor Green
    Write-Host "URL: $($response.html_url)" -ForegroundColor Green
    Write-Host "Clone URL: $($response.clone_url)" -ForegroundColor Green

    # Set remote and push
    Write-Host "Setting up git remote and pushing code..." -ForegroundColor Yellow
    git remote set-url origin $response.clone_url
    git push -u origin main

    Write-Host "Repository setup complete!" -ForegroundColor Green
    Write-Host "View repository: $($response.html_url)" -ForegroundColor Green

} catch {
    Write-Host "ERROR: Failed to create repository:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red

    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "INFO: Repository might already exist. Trying to push to existing repo..." -ForegroundColor Yellow
        try {
            $existingUrl = "https://github.com/$githubUsername/$repoName.git"
            git remote set-url origin $existingUrl
            git push -u origin main
            Write-Host "SUCCESS: Code pushed to existing repository!" -ForegroundColor Green
        } catch {
            Write-Host "ERROR: Failed to push to existing repository" -ForegroundColor Red
        }
    }
}
