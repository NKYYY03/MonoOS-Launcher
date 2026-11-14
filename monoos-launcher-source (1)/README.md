# MonoOS Launcher

Lightweight Android Home Launcher combining Nothing OS monochromatic restraint with iOS-grade spring physics, Dynamic Capsule, Control Center, Spotlight Search, and modular widgets.

## Quick Import to GitHub

1. Export/Download this project from AI Studio (or use the **GitHub** button in the top-right toolbar—`.github/workflows/` was moved out to `android/BUILD_APK_WORKFLOW.yml` so GitHub export will not trigger workflow permission errors).
2. If you downloaded the ZIP, open a terminal in the project folder and run:

```bash
git init
git add .
git commit -m "Initial MonoOS Launcher"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/monoos-launcher.git
git push -u origin main
```

## Build the Android APK on GitHub (No Android Studio Needed)

1. Open your GitHub repository in a browser.
2. Click **Add file → Create new file**.
3. Type `.github/workflows/build-apk.yml` as the file path.
4. Copy and paste the contents of `android/BUILD_APK_WORKFLOW.yml` from your repo and commit it.
5. Open the **Actions** tab → **Build MonoOS Launcher APK** → download **`MonoOS-Launcher-debug-apk`** from Artifacts.
