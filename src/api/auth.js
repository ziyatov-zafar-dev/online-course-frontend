import api from "./index"

// Sign Up
export const signUp = (data) => api.post("/auth/sign-up", data)
export const verifySignUp = (data) => api.post("/auth/sign-up/verify", data)

// Sign In
export const signIn = (data) => api.post("/auth/sign-in", data)
export const verifySignIn = (email, otp) =>
	api.post("/auth/sign-in/verify", {
		email,
		code: otp,
	})

// Password reset
export const forgotPassword = (email) => {
	return api.post("/auth/forgot-password", { email })
}
export const resetPassword = (data) => api.post("/auth/reset-password", data)

// Refresh token
export const refreshToken = (data) => api.post("/auth/refresh-token", data)

// Username check
export const validateUsername = (username) =>
	api.get(`/auth/validate-username?username=${username}`)

// Gemini description
export const getGeminiDescription = (desc) =>
	api.get(`/auth/gemini/description/${desc}`)
