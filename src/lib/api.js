// filepath: /home/sadd/Desktop/real-pr/src/lib/api.js
import axios from "axios"

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
})

// Request interceptor
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("access_token")
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// Response interceptor (Refresh token)
api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const original = error.config

		// ❌ Internet yo'q yoki server ishlamayapti
		if (!error.response) {
			return Promise.reject({
				message: "Server bilan bog'lanib bo'lmadi. Internetni tekshiring.",
			})
		}

		const status = error.response.status
		const errorMessage = error.response.data?.message || ""

		// ❌ Sessiya tugagan (400 yoki 401 bilan kelishi mumkin)
		const isSessionExpired =
			(status === 401 || status === 400) &&
			errorMessage.toLowerCase().includes("sessiya")

		// ❌ Access token eskirgan → Refresh qilish
		if ((status === 401 || isSessionExpired) && !original._retry) {
			original._retry = true

			try {
				const refresh = localStorage.getItem("refresh_token")

				if (!refresh) {
					throw new Error("No refresh token")
				}

				const res = await api.post("/auth/refresh-token", {
					refreshToken: refresh,
				})

				localStorage.setItem("access_token", res.data.accessToken)
				localStorage.setItem("refresh_token", res.data.refreshToken)

				original.headers.Authorization = `Bearer ${res.data.accessToken}`

				return api(original)
			} catch (err) {
				// ❌ Refresh token ham tugagan → Log out qilish
				localStorage.removeItem("access_token")
				localStorage.removeItem("refresh_token")

				// Login sahifasiga yo'naltirish
				window.location.href = "/sign-in"

				return Promise.reject({
					message: "Sessiya tugadi. Iltimos qayta tizimga kiring.",
				})
			}
		}

		return Promise.reject(error)
	}
)

export default api
