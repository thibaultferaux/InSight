const IS_DEV = process.env.APP_VARIANT === "development";

export default {
    name: IS_DEV ? "InSight (Dev)" : "InSight",
    slug: "InSight",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
    },
    updates: {
        fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
        jsEngine: "hermes",
        bundleIdentifier: IS_DEV ? 'com.Insight.dev' : 'com.InSight',
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#FFFFFF"
        },
        package: IS_DEV ? "com.Insight.dev" : "com.InSight",
        jsEngine: "hermes"
    },
    web: {
        "favicon": "./assets/favicon.png"
    },
    extra: {
        eas: {
            projectId: "7e0a32a8-5f4b-423d-b80c-cca84f072557"
        }
    },
    primaryColor: "#8b5cf6",
    androidStatusBar: {
        barStyle: "dark-content",
        backgroundColor: "#f8fafc"
    }
}
