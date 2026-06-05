# Test date parsing fix for T3 endpoint
$body = @{
    kehamilan_id = 1
    tanggal_periksa = "2026-06-12"
    tekanan_darah = "120/80"
    berat_badan = 72.5
    tinggi_uterus = 32
    hasil_pemeriksaan = "Normal"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/tenaga-kesehatan/pemeriksaan-dokter-t3-complete" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body
    
    Write-Host "✅ SUCCESS - Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED - Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
