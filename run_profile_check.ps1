$login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/auth/login' -Method Post -Body (ConvertTo-Json @{email='e2e_test_user@example.com'; password='Password123'}) -ContentType 'application/json'
$token = $login.access_token
Write-Host 'Login ok, token length:' ($token.Length)
$profile = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/profile/' -Method Get -ContentType 'application/json' -Headers @{Authorization = "Bearer $token"}
$profile | ConvertTo-Json -Depth 5 | Write-Host
