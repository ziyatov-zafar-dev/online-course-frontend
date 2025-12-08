import api from "./index"

// ==================== USERS ====================

// Get all users
export const getUsers = (params) => api.get("/admin/users", { params })

// Get single user by ID
export const getUser = (userId) => api.get(`/admin/users/${userId}`)

// Update user
export const updateUser = (userId, payload) =>
	api.put(`/admin/users/${userId}`, payload)

// Delete user
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`)

// Ban/Block user
export const banUser = (userId) => api.post(`/admin/users/${userId}/ban`)

// Unban user
export const unbanUser = (userId) => api.post(`/admin/users/${userId}/unban`)

// Change user role
export const changeUserRole = (userId, role) =>
	api.put(`/admin/users/${userId}/role`, { role })
