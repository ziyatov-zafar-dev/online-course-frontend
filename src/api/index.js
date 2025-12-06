import axios from "axios"

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
})

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("access_token")
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

// Refresh token avtomatik
api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const original = error.config

		if (error.response?.status === 401 && !original._retry) {
			original._retry = true

			try {
				const refresh = localStorage.getItem("refresh_token")
				const res = await api.post("/auth/refresh-token", {
					refreshToken: refresh,
				})

				localStorage.setItem("access_token", res.data.accessToken)
				localStorage.setItem("refresh_token", res.data.refreshToken)

				original.headers.Authorization = `Bearer ${res.data.accessToken}`

				return api(original)
			} catch (e) {
				// Refresh token failed
			}
		}

		return Promise.reject(error)
	}
)

export default api
