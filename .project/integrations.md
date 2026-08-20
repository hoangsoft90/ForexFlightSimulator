# Integrations & System Configuration

## AdMob (react-native-google-mobile-ads)

### Config

File: `src/config.ts`

```typescript
export const config = {
  testAds: true,  // ← set to false for production
  adUnits: {
    banner: {
      android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    interstitial: {
      android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
  },
};
```

### Test Ad Unit IDs (Google Official)

| Type | Ad Unit ID |
|------|-----------|
| Banner (Adaptive) | `ca-app-pub-3940256099942544/6300978111` |
| Interstitial | `ca-app-pub-3940256099942544/1033173712` |

### Placement

| Screen | Ad Type | Position | Trigger |
|--------|---------|----------|---------|
| Home (`index.tsx`) | Banner (adaptive) | Bottom of ScrollView | Always visible |
| Autopsy (`autopsy.tsx`) | Interstitial (full-screen) | — | "Back to profile" tap |

### Initialization Flow

```
_layout.tsx mount
  → initAds()
    → Platform.select: native only (web excluded)
    → mobileAds().initialize()
  → preloadInterstitial()
    → InterstitialAd.createForAdRequest(adUnitId)
    → Event listeners: LOADED, CLOSED, ERROR
    → interstitial.load()
```

### Platform Guard (Web Safety)

```typescript
// ads.ts — uses Platform.select to exclude native module from web bundle
const nativeAds = Platform.select({
  native: (() => {
    try { return require('react-native-google-mobile-ads'); }
    catch { return null; }
  })(),
  default: null,
});
```

### Production Checklist

1. Set `testAds: false` in `src/config.ts`
2. Replace ad unit IDs with real ones
3. Update `androidAppId` / `iosAppId` in `app.json`
4. Update `googleServicesFile` in `app.json` (GoogleService-Info.plist / google-services.json)

## Third-Party Libraries

| Library | Version | Purpose | Bundle Impact |
|---------|---------|---------|---------------|
| `expo` | ~57.0.14 | Core framework | — |
| `react-native` | 0.86.2 | UI runtime | — |
| `expo-router` | ~57.0.14 | File-based routing | — |
| `zustand` | ^5.0.0 | State management | ~1KB gzipped |
| `@react-native-async-storage/async-storage` | 2.2.0 | Local persistence | ~15KB |
| `@tabler/icons-react-native` | ^3.46.0 | Icon set | Tree-shakeable |
| `react-native-svg` | 15.15.4 | Candle chart rendering | ~40KB |
| `react-native-reanimated` | 4.5.1 | Animations | ~50KB |
| `react-native-gesture-handler` | ~2.32.0 | Touch handling | ~30KB |
| `react-native-safe-area-context` | ~5.7.0 | Safe area insets | ~5KB |
| `react-native-screens` | ~4.26.0 | Native screen containers | ~15KB |
| `react-native-google-mobile-ads` | ^16.5.0 | AdMob ads | ~20KB (native only) |
| `react-native-web` | ~0.21.0 | Web support | ~50KB |

### Removed Libraries

| Library | Reason |
|---------|--------|
| `react-native-wagmi-charts` | Incompatible with Reanimated 4 (SDK 57) — `getDomain` circular import crash. Replaced with custom SVG renderer. |

## CI/CD: GitHub Actions

### Workflow: Build Debug APK

File: `.github/workflows/build-debug-apk.yml`

```yaml
Trigger: push to main + manual dispatch
Runner: ubuntu-latest (timeout: 30min)

Steps:
1. Checkout
2. Setup Node.js 22 + npm ci
3. Expo prebuild --platform android --clean
4. Setup JDK 17 (Temurin)
5. Cache Gradle packages
6. chmod +x gradlew
7. ./gradlew assembleDebug --no-daemon
8. Upload artifact (retained 14 days)
```

### Build Commands

```bash
# Push to trigger build
git push origin main

# Check build status
curl -s -H "Authorization: token $GH_TOKEN" \
  "https://api.github.com/repos/hoangsoft90/ForexFlightSimulator/actions/runs?per_page=1"

# Download APK artifact
# (from GitHub UI or API)
```

### Android SDK Config

| Property | Value |
|----------|-------|
| compileSdkVersion | 36 |
| targetSdkVersion | 36 |
| minSdkVersion | 24 |
| package | `com.forexflightsimulator.app` |
| Plugin | `expo-build-properties` |

## Expo Config Plugins

```json
{
  "plugins": [
    ["expo-build-properties", {
      "android": {
        "compileSdkVersion": 36,
        "targetSdkVersion": 36,
        "minSdkVersion": 24
      }
    }],
    "expo-router",
    ["expo-splash-screen", { "image": "./assets/images/splash-icon.png" }]
  ]
}
```

## Deep Link

- **Scheme:** `forex-flight-simulator://`
- **Config:** `app.json` → `"scheme": "forex-flight-simulator"`
- **Routes:** `/`, `/decision`, `/autopsy`
- **Guards:** `/decision` and `/autopsy` redirect to `/` if no session data
