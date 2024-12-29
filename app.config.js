require('dotenv').config();

export default {
    "expo": {
        "name": "frontend",
        "slug": "frontend",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/icon.png",
        "userInterfaceStyle": "light",
        "newArchEnabled": true,
        "splash": {
            "image": "./assets/splash-icon.png",
            "resizeMode": "contain",
            "backgroundColor": "#ffffff"
        },
        "ios": {
            "supportsTablet": true
        },
        "android": {
            "adaptiveIcon": {
                "foregroundImage": "./assets/adaptive-icon.png",
                "backgroundColor": "#ffffff"
            },
            "package": "com.ButorinIV.diabetes_calculator",
            "versionCode": 1
        },
        "ios": {
            "bundleIdentifier": "com.ButorinIV.diabetes-calculator"
        },
        "web": {
            "favicon": "./assets/favicon.png"
        },
        "plugins": [
            [
                "expo-notifications",
                {
                    // "icon": "./assets/notification-icon.png",
                    "color": "#ffffff",
                    // "sounds": ["./assets/notification-sound.wav"]
                }
            ]
        ],
        "extra": {
            "recaptchaSiteKey": process.env.RECAPTCHA_SITE_KEY,
            "baseUrl": process.env.BASE_URL || "https://api.diabetes-calculator.ilyacode.ru",
            "eas": {
                "projectId": "277f8d2f-254b-4b6b-9d97-13019872429c"
            }
        }
    }
}; 