import { signInWithPopup, signOut as firebaseSignOut, type UserCredential, GoogleAuthProvider } from "firebase/auth"
import { auth, googleProvider } from "@/config/firebase"

// Define the shape of the user data we'll extract from Firebase
export interface FirebaseUserData {
	id?: string
	email?: string | null
	fullName?: string | null
	photoURL?: string | null
	accessToken: string | undefined
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<FirebaseUserData> => {
	try {
		console.log("Starting Google sign-in process...")

		// Make sure we're using the correct provider
		const provider = googleProvider
		console.log("Using provider:", provider)

		// Attempt sign in
		const result: UserCredential = await signInWithPopup(auth, provider)
		console.log("Sign-in successful, user:", result.user)

		// This gives you a Google Access Token. You can use it to access the Google API.
		const credential = GoogleAuthProvider.credentialFromResult(result)
		console.log("Google Access Token:", credential);

		const token = await result.user.getIdToken();

		// The signed-in user info
		const user = result.user;

		console.log("User info:", user)

		// Extract the user data we need
		const userData: FirebaseUserData = {
			id: user.uid,
			email: user.email,
			fullName: user.displayName,
			photoURL: user.photoURL,
			accessToken: token,
		}

		return userData
	} catch (error: any) {
		// Handle Errors here
		const errorCode = error.code
		const errorMessage = error.message

		console.error("Google sign-in error details:", {
			code: errorCode,
			message: errorMessage,
			fullError: error,
		})

		// Provide more specific error messages based on error code
		if (errorCode === "auth/configuration-not-found") {
			console.error("Firebase OAuth configuration issue. Please check your Firebase console settings.")
			throw new Error("Authentication configuration error. Please contact support.")
		} else if (errorCode === "auth/popup-blocked") {
			throw new Error("Popup was blocked by your browser. Please allow popups for this site.")
		} else if (errorCode === "auth/popup-closed-by-user") {
			throw new Error("Authentication was cancelled. Please try again.")
		} else if (errorCode === "auth/unauthorized-domain") {
			console.error("Your domain is not authorized in Firebase console.")
			throw new Error("This website is not authorized to use Firebase authentication.")
		}

		throw error
	}
}

// Sign out
export const signOut = async (): Promise<void> => {
	try {
		await firebaseSignOut(auth)
	} catch (error) {
		console.error("Sign out error:", error)
		throw error
	}
}

