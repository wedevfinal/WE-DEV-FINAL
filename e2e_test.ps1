try {
  $register = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/auth/register' -Method Post -Body (ConvertTo-Json @{name='E2E Tester'; email='e2e_test_user@example.com'; password='Password123'}) -ContentType 'application/json' -ErrorAction Stop
  Write-Host 'Register:'
  $register | ConvertTo-Json -Depth 5 | Write-Host
} catch {
  Write-Host 'Register error or user may already exist:' $_.Exception.Message
}

$login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/auth/login' -Method Post -Body (ConvertTo-Json @{email='e2e_test_user@example.com'; password='Password123'}) -ContentType 'application/json'
Write-Host 'Login response:'
$login | ConvertTo-Json -Depth 5 | Write-Host
$token = $login.access_token
Write-Host 'Token:' $token

$profileResp = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/profile/' -Method Put -Body (ConvertTo-Json @{monthly_income=50000; monthly_savings=10000; investable_amount=20000; risk_goal='balanced'}) -ContentType 'application/json' -Headers @{Authorization = "Bearer $token"}
Write-Host 'Profile saved:'
$profileResp | ConvertTo-Json -Depth 5 | Write-Host
