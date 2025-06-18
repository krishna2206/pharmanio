import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "PharmAnio",
  slug: "pharmanio",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "pharmanio-scheme",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "mg.krishna.pharmanio",
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "This app requires access to your location when open.",
      NSLocationAlwaysAndWhenInUseUsageDescription: "This app requires access to your location even when closed.",
      NSLocationAlwaysUsageDescription:  "This app requires access to your location when open.",
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    permissions: [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION"
    ],
    package: "mg.krishna.pharmanio"
  },
  plugins: [
    "expo-router",
    "expo-localization",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "This app uses location to provide location-based features.",
        locationAlwaysPermission: "This app uses location to provide location-based features.",
        locationWhenInUsePermission: "This app uses location to provide location-based features."
      }
    ],
    [
      "@rnmapbox/maps",
      {
        RNMapboxMapsDownloadToken: process.env.EXPO_PUBLIC_MAPBOX_DOWNLOAD_TOKEN
      }
    ],
    [
      "expo-splash-screen",
      {
        "backgroundColor": "#3de998",
        "image": "./assets/images/splash-icon.png",
        "dark": {
          "image": "./assets/images/splash-icon-dark.png",
          "backgroundColor": "#0F172A"
        },
        "imageWidth": 200
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  }
});