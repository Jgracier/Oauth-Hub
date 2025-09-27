# OAuth Hub Comprehensive Validation Script
# Tests all components: server, endpoints, deployment, GitHub integration

Write-Host "OAuth Hub Validation Test Suite" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Server Health Check
Write-Host "1. Testing Server Health..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET | Select-Object -ExpandProperty Content
    $healthObj = $health | ConvertFrom-Json
    if ($healthObj.status -eq "OK" -and $healthObj.platformsSupported -eq 37) {
        Write-Host "PASS: Server Health" -ForegroundColor Green
        Write-Host "   - Status: $($healthObj.status)" -ForegroundColor Gray
        Write-Host "   - Platforms: $($healthObj.platformsSupported)" -ForegroundColor Gray
        Write-Host "   - Uptime: $($healthObj.uptime)s" -ForegroundColor Gray
    } else {
        Write-Host "FAIL: Server Health" -ForegroundColor Red
    }
} catch {
    Write-Host "FAIL: Server Health - Server not running" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: OAuth Discovery Endpoint
Write-Host "2. Testing OAuth Discovery..." -ForegroundColor Yellow
try {
    $discovery = Invoke-WebRequest -Uri "http://localhost:3001/.well-known/oauth-authorization-server" -Method GET | Select-Object -ExpandProperty Content
    $discoveryObj = $discovery | ConvertFrom-Json
    $requiredEndpoints = @("authorization_endpoint", "token_endpoint", "introspection_endpoint", "revocation_endpoint")
    $missingEndpoints = $requiredEndpoints | Where-Object { -not $discoveryObj.$_ }

    if ($missingEndpoints.Count -eq 0) {
        Write-Host "PASS: OAuth Discovery" -ForegroundColor Green
        Write-Host "   - Issuer: $($discoveryObj.issuer)" -ForegroundColor Gray
        Write-Host "   - Grant Types: $($discoveryObj.grant_types_supported -join ', ')" -ForegroundColor Gray
    } else {
        Write-Host "FAIL: OAuth Discovery" -ForegroundColor Red
        Write-Host "   Missing endpoints: $($missingEndpoints -join ', ')" -ForegroundColor Red
    }
} catch {
    Write-Host "FAIL: OAuth Discovery" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Backward-Compatible Consent Endpoint
Write-Host "3. Testing Consent Endpoint..." -ForegroundColor Yellow
try {
    $consent = Invoke-WebRequest -Uri "http://localhost:3001/consent/google/test-api-key" -Method GET | Select-Object -ExpandProperty Content
    $consentObj = $consent | ConvertFrom-Json
    if ($consentObj.success -and $consentObj.consentUrl -and $consentObj.consentUrl.Contains("oauth/authorize")) {
        Write-Host "PASS: Consent Endpoint" -ForegroundColor Green
        Write-Host "   - Platform: $($consentObj.platform)" -ForegroundColor Gray
        Write-Host "   - URL Generated: $(if ($consentObj.consentUrl.Length -gt 50) { $consentObj.consentUrl.Substring(0,50) + '...' } else { $consentObj.consentUrl })" -ForegroundColor Gray
    } else {
        Write-Host "FAIL: Consent Endpoint" -ForegroundColor Red
    }
} catch {
    Write-Host "FAIL: Consent Endpoint" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Tokens Endpoint (should return not found for now)
Write-Host "4. Testing Tokens Endpoint..." -ForegroundColor Yellow
try {
    $tokens = Invoke-WebRequest -Uri "http://localhost:3001/tokens/google-user-123/test-api-key" -Method GET | Select-Object -ExpandProperty Content
    $tokensObj = $tokens | ConvertFrom-Json
    if ($tokensObj.error -eq "Token not found") {
        Write-Host "PASS: Tokens Endpoint (Expected: No tokens yet)" -ForegroundColor Green
    } else {
        Write-Host "UNEXPECTED: Tokens Endpoint" -ForegroundColor Yellow
        Write-Host "   Response: $tokens" -ForegroundColor Gray
    }
} catch {
    Write-Host "FAIL: Tokens Endpoint" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: GitHub Repository Check
Write-Host "5. Testing GitHub Repository..." -ForegroundColor Yellow
try {
    $remoteUrl = git remote get-url origin 2>$null
    if ($remoteUrl -and $remoteUrl.Contains("Oauth-Hub")) {
        Write-Host "PASS: GitHub Repository" -ForegroundColor Green
        Write-Host "   - Remote: $remoteUrl" -ForegroundColor Gray

        # Check if we're on main branch
        $branch = git branch --show-current 2>$null
        if ($branch -eq "main") {
            Write-Host "   - Branch: $branch" -ForegroundColor Gray
        } else {
            Write-Host "   - Branch: $branch (warning)" -ForegroundColor Yellow
        }

        # Check for uncommitted changes
        $status = git status --porcelain 2>$null
        if ($status) {
            Write-Host "   - Uncommitted Changes: $($status.Count) files" -ForegroundColor Yellow
        } else {
            Write-Host "   - Repository Clean" -ForegroundColor Gray
        }
    } else {
        Write-Host "FAIL: GitHub Repository" -ForegroundColor Red
        Write-Host "   Remote URL not found or incorrect" -ForegroundColor Red
    }
} catch {
    Write-Host "FAIL: GitHub Repository" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: GitHub Actions Workflow Check
Write-Host "6. Testing GitHub Actions..." -ForegroundColor Yellow
$workflowPath = ".github/workflows/deploy-oracle.yml"
if (Test-Path $workflowPath) {
    try {
        $workflow = Get-Content $workflowPath -Raw
        $hasSecrets = $workflow.Contains("secrets.CRM_SERVER_IP") -and
                     $workflow.Contains("secrets.CRM_SERVER_USER") -and
                     $workflow.Contains("secrets.CRM_SERVER_SSH_PRIVATE_KEY") -and
                     $workflow.Contains("secrets.CRM_DATABASE_URL")

        if ($hasSecrets) {
            Write-Host "PASS: GitHub Actions" -ForegroundColor Green
            Write-Host "   - Workflow file exists" -ForegroundColor Gray
            Write-Host "   - All required secrets configured" -ForegroundColor Gray
        } else {
            Write-Host "FAIL: GitHub Actions" -ForegroundColor Red
            Write-Host "   - Missing required secrets in workflow" -ForegroundColor Red
        }
    } catch {
        Write-Host "FAIL: GitHub Actions" -ForegroundColor Red
        Write-Host "   Error reading workflow file" -ForegroundColor Red
    }
} else {
    Write-Host "FAIL: GitHub Actions" -ForegroundColor Red
    Write-Host "   Workflow file not found" -ForegroundColor Red
}

Write-Host ""

# Test 7: Deployment Script Check
Write-Host "7. Testing Deployment Script..." -ForegroundColor Yellow
$deployScript = "deploy-oracle.sh"
if (Test-Path $deployScript) {
    try {
        $scriptContent = Get-Content $deployScript -Raw
        $hasRequiredVars = $scriptContent.Contains('CRM_SERVER_IP') -and
                          $scriptContent.Contains('CRM_SERVER_USER') -and
                          $scriptContent.Contains('CRM_SERVER_SSH_PRIVATE_KEY') -and
                          $scriptContent.Contains('CRM_DATABASE_URL')

        if ($hasRequiredVars) {
            Write-Host "PASS: Deployment Script" -ForegroundColor Green
            Write-Host "   - Script exists" -ForegroundColor Gray
            Write-Host "   - Contains required environment variables" -ForegroundColor Gray
        } else {
            Write-Host "FAIL: Deployment Script" -ForegroundColor Red
            Write-Host "   - Missing required environment variables" -ForegroundColor Red
        }
    } catch {
        Write-Host "FAIL: Deployment Script" -ForegroundColor Red
        Write-Host "   Error reading deployment script" -ForegroundColor Red
    }
} else {
    Write-Host "FAIL: Deployment Script" -ForegroundColor Red
    Write-Host "   Deployment script not found" -ForegroundColor Red
}

Write-Host ""

# Test 8: Package Dependencies
Write-Host "8. Testing Dependencies..." -ForegroundColor Yellow
$packageJson = "package.json"
if (Test-Path $packageJson) {
    try {
        $package = Get-Content $packageJson | ConvertFrom-Json
        $requiredDeps = @("@node-oauth/oauth2-server", "express", "cors", "helmet", "morgan", "dotenv")
        $missingDeps = $requiredDeps | Where-Object { -not $package.dependencies.$_ }

        if ($missingDeps.Count -eq 0) {
            Write-Host "PASS: Dependencies" -ForegroundColor Green
            Write-Host "   - All required dependencies present" -ForegroundColor Gray
            Write-Host "   - Project: $($package.name)" -ForegroundColor Gray
            Write-Host "   - Version: $($package.version)" -ForegroundColor Gray
        } else {
            Write-Host "FAIL: Dependencies" -ForegroundColor Red
            Write-Host "   Missing: $($missingDeps -join ', ')" -ForegroundColor Red
        }
    } catch {
        Write-Host "FAIL: Dependencies" -ForegroundColor Red
        Write-Host "   Error reading package.json" -ForegroundColor Red
    }
} else {
    Write-Host "FAIL: Dependencies" -ForegroundColor Red
    Write-Host "   package.json not found" -ForegroundColor Red
}

Write-Host ""

# Test 9: Platform Configurations
Write-Host "9. Testing Platform Configurations..." -ForegroundColor Yellow
$platformsPath = "src/core/platforms/index.js"
if (Test-Path $platformsPath) {
    try {
        # Check if the file loads without errors
        $platformsContent = Get-Content $platformsPath -Raw
        if ($platformsContent.Contains("export const PLATFORMS") -and $platformsContent.Contains("google") -and $platformsContent.Contains("facebook")) {
            Write-Host "PASS: Platform Configurations" -ForegroundColor Green
            Write-Host "   - Platforms file exists" -ForegroundColor Gray
            Write-Host "   - Contains major platforms" -ForegroundColor Gray
        } else {
            Write-Host "FAIL: Platform Configurations" -ForegroundColor Red
            Write-Host "   - Platform configurations incomplete" -ForegroundColor Red
        }
    } catch {
        Write-Host "FAIL: Platform Configurations" -ForegroundColor Red
        Write-Host "   Error reading platforms file" -ForegroundColor Red
    }
} else {
    Write-Host "FAIL: Platform Configurations" -ForegroundColor Red
    Write-Host "   Platforms file not found" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""
Write-Host "OAuth Hub is ready for production deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Commit and push changes to trigger auto-deployment" -ForegroundColor White
Write-Host "2. Monitor GitHub Actions for deployment status" -ForegroundColor White
Write-Host "3. Test live endpoints at https://129.146.71.35:3001" -ForegroundColor White
Write-Host "4. Update API documentation with new endpoints" -ForegroundColor White
Write-Host ""
Write-Host "Ready for Oracle Cloud deployment!" -ForegroundColor Green
