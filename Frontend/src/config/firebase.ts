// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { SeccretKey } from "@/secret/secret"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
	apiKey: SeccretKey.FIREBASE_API_KEY,
	authDomain: SeccretKey.FIREBASE_AUTH_DOMAIN,
	projectId: SeccretKey.FIREBASE_PROJECT_ID,
	storageBucket: SeccretKey.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: SeccretKey.FIREBASE_MESSAGING_SENDER_ID,
	appId: SeccretKey.FIREBASE_APP_ID,
	measurementId: SeccretKey.FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app)
// const analytics = getAnalytics(app)

// Create and configure Google provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
	prompt: "select_account",
})

export { app, auth, googleProvider }

