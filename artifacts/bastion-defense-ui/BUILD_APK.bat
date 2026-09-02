@echo off
echo ================================================================================
echo BASTION DEFENSE - APK BUILDER
echo ================================================================================
echo.

REM Set environment variables
set ANDROID_HOME=C:\Users\SAY3D\AppData\Local\Android\Sdk
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin;%JAVA_HOME%\bin

echo Step 1: Checking Java...
"%JAVA_HOME%\bin\java.exe" -version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Java not found!
    pause
    exit /b 1
)
echo.

echo Step 2: Building web app...
set CAPACITOR_BUILD=true
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Web build failed!
    pause
    exit /b 1
)
echo.

echo Step 3: Syncing to Android...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)
echo.

echo Step 4: Building APK...
cd android
call gradlew.bat assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: APK build failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo ================================================================================
echo SUCCESS! APK built successfully!
echo ================================================================================
echo.
echo APK Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo You can now:
echo 1. Copy the APK to your phone manually
echo 2. Or run: cd android ^&^& gradlew installDebug (if phone is connected via USB)
echo.
pause
