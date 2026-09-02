# Bastion Defense - Android APK Build Guide

This guide will help you build an Android APK of your Bastion Defense game for testing on your Android device.

## Prerequisites

Before you can build the APK, you need to install the following tools:

### 1. Install pnpm (Package Manager)

Since this project uses pnpm, you need to install it first. Open PowerShell as Administrator and run:

```powershell
npm install -g pnpm
```

Verify installation:
```powershell
pnpm --version
```

### 2. Install Java JDK 17 or higher

Download and install from: https://adoptium.net/

After installation, verify:
```powershell
java -version
```

### 3. Install Android Studio

1. Download from: https://developer.android.com/studio
2. Install Android Studio
3. During setup, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (optional, for emulator)

4. Set up environment variables:
   - Open System Properties → Environment Variables
   - Add `ANDROID_HOME` pointing to your Android SDK location (usually `C:\Users\YourName\AppData\Local\Android\Sdk`)
   - Add to PATH: `%ANDROID_HOME%\platform-tools`
   - Add to PATH: `%ANDROID_HOME%\tools`

## Installation Steps

### Step 1: Install Dependencies

Navigate to the project directory and install dependencies:

```powershell
cd "c:\Users\SAY3D\Bastion Defense"
pnpm install
```

### Step 2: Build the Web App

```powershell
cd artifacts\bastion-defense-ui
pnpm run build:mobile
```

This will create an optimized production build in the `dist` folder.

### Step 3: Add Android Platform

If this is your first time, initialize the Android platform:

```powershell
npx cap add android
```

This creates the `android` folder with your native Android project.

### Step 4: Sync Web Assets to Android

Whenever you rebuild your web app, sync the changes:

```powershell
npx cap sync android
```

## Building the APK

### Option A: Using Android Studio (Recommended for first-time)

1. Open Android Studio:
   ```powershell
   npx cap open android
   ```

2. Wait for Gradle to sync (this may take a few minutes the first time)

3. Build the APK:
   - Click **Build** menu → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Wait for the build to complete
   - Click the notification that says "locate" to find your APK

4. The APK will be located at:
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```

### Option B: Using Command Line (Faster for subsequent builds)

Navigate to the android folder and build:

```powershell
cd android
.\gradlew assembleDebug
```

The APK will be at: `android\app\build\outputs\apk\debug\app-debug.apk`

## Installing on Your Android Device

### Method 1: USB Connection

1. Enable Developer Options on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. Connect your device via USB

3. Install the APK:
   ```powershell
   cd android
   .\gradlew installDebug
   ```

### Method 2: Manual Transfer

1. Copy the APK file `app-debug.apk` to your phone
2. On your phone, navigate to the APK file
3. Tap to install (you may need to allow installation from unknown sources)

## Quick Reference Commands

After initial setup, use these commands for subsequent builds:

```powershell
# Navigate to the UI project
cd "c:\Users\SAY3D\Bastion Defense\artifacts\bastion-defense-ui"

# Build web app and sync to Android
pnpm run build:mobile
npx cap sync android

# Option 1: Open in Android Studio
npx cap open android

# Option 2: Build APK via command line
cd android
.\gradlew assembleDebug
```

## Troubleshooting

### "pnpm: command not found"
- Install pnpm globally: `npm install -g pnpm`
- Restart your terminal

### "ANDROID_HOME not set"
- Set environment variable pointing to Android SDK
- Restart your terminal/IDE

### "Gradle sync failed"
- Open Android Studio and let it download required dependencies
- Check that you have a stable internet connection

### "Unable to install APK"
- Enable "Install from Unknown Sources" in Android settings
- Make sure USB debugging is enabled
- Try `.\gradlew uninstallDebug` then `.\gradlew installDebug`

### Build errors in Android Studio
- Make sure you're using Java JDK 17 or higher
- File → Invalidate Caches → Restart
- Delete `android\.gradle` folder and rebuild

## App Configuration

The app is configured with:
- **App ID**: `com.bastiondefense.game`
- **App Name**: `Bastion Defense`
- **Build Type**: Debug APK (for testing)

To change these, edit `capacitor.config.ts`.

## Creating a Release APK (for Production)

For a signed release APK that you can publish:

1. Generate a keystore (one-time):
   ```powershell
   keytool -genkey -v -keystore bastion-defense.keystore -alias bastion -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Build release APK:
   ```powershell
   cd android
   .\gradlew assembleRelease
   ```

3. Sign the APK using your keystore (Android Studio can help with this)

## Need Help?

- Capacitor Docs: https://capacitorjs.com/docs
- Android Studio Guide: https://developer.android.com/studio/run
- Gradle Build Guide: https://developer.android.com/studio/build/building-cmdline
