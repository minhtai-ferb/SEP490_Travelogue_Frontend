"use client"

import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

// Define the User interface
export interface User {
	id?: string
	email?: string
	avatarUrl?: string
	username?: string
	fullName?: string
	photoURL?: string // Added for Google profile photos
	provider?: "email" | "google" // Track authentication provider
	// Add other user properties as needed
	accessToken?: string
	isEmailVerified?: boolean
}

// Create an atom that persists in localStorage
export const userAtom = atomWithStorage<User | null>("USER", null)

// Create an atom for loading state
export const isLoadingAtom = atom(false)

// Helper function to update user in localStorage and atom
export const updateUser = (user: User | null) => {
	if (user) {
		localStorage.setItem("USER", JSON.stringify(user))
		localStorage.setItem("token", user.id || "") // Use user ID as token for simplicity
	} else {
		localStorage.removeItem("USER")
		localStorage.removeItem("token")
	}

	// This will trigger a re-render in components that use the userAtom
	// The atomWithStorage will handle updating the atom value
}

