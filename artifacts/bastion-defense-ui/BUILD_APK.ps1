#!/usr/bin/env pwsh

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "BASTION DEFENSE - APK BUILDER" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:ANDROID_HOME = "C:\Users\SAY3D\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:JAVA_HOME\bin"

Write-Host "Step 1: Checking Java..." -ForegroundColor Yellow
& "$env:JAVA_HOME\bin\java.exe" -version
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Java not found!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host ""

Write-Host "Step 2: Building web app..." -ForegroundColor Yellow
$env:CAPACITOR_BUILD = "true"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Web build failed!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host ""

Write-Host "Step 3: Syncing to Android..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Capacitor sync failed!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host ""

Write-Host "Step 4: Building APK..." -ForegroundColor Yellow
Set-Location android
.\gradlew.bat assembleDebug
$buildResult = $LASTEXITCODE
Set-Location ..

if ($buildResult -ne 0) {
    Write-Host "ERROR: APK build failed!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host ""

Write-Host "================================================================================" -ForegroundColor Green
Write-Host "SUCCESS! APK built successfully!" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "APK Location: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now:" -ForegroundColor Yellow
Write-Host "1. Copy the APK to your phone manually" -ForegroundColor White
Write-Host "2. Or run: cd android && .\gradlew installDebug (if phone is connected via USB)" -ForegroundColor White
Write-Host ""
pause
