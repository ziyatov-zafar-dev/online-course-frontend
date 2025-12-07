import api from "@/lib/api"

export function getMe() {
	return api.get("/api/users/me")
}

export function updateProfile(data) {
	return api.patch("/api/users/me/profile", data)
}

export function uploadProfileImage(file) {
	const formData = new FormData()
	formData.append("file", file)
	return api.post("/users/me/profile/image", formData)
}

export function changeUsername(username) {
	return api.post("/api/users/me/change-username", { username })
}

export function changePassword(data) {
	return api.post("/api/users/me/change-password", data)
}

export function requestChangeEmail(email) {
	return api.post("/api/users/me/change-email/request", { email })
}

export function verifyChangeEmail(data) {
	return api.post("/api/users/me/change-email/verify", data)
}
