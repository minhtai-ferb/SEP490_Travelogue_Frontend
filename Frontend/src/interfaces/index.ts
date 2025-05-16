// contain interface

// interface User {
//     id: number;
//     name: string;
//     email: string;
// }

export interface User {
	id?: string
	email?: string
	avatar?: string
	username?: string
	fullName?: string
	photoURL?: string
	provider?: "email" | "google"
	accessToken?: string
	roles?: string[]
}
