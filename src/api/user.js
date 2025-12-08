import api from "./index"

// Get current user profile
export function getMe() {
	return api.get("/users/me")
}

// Update profile
export function updateProfile(data) {
	return api.patch("/users/me/profile", data)
}

// Upload profile image
export function uploadProfileImage(file) {
	const formData = new FormData()
	formData.append("file", file)
	return api.post("/users/me/profile/image", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
}

// Change username
export function changeUsername(newUsername) {
	return api.post("/users/me/change-username", { newUsername })
}

// Change password
export function changePassword(data) {
	return api.post("/users/me/change-password", data)
}

// Request change email - send code to new email
export function requestChangeEmail(newEmail) {
	return api.post("/users/me/change-email/request", { newEmail })
}

// Verify change email with code
export function verifyChangeEmail(data) {
	return api.post("/users/me/change-email/verify", data)
}
