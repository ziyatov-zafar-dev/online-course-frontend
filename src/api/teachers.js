import api from "./index"

// ==================== GET ====================

// Get all teachers
export const getTeachers = () => api.get("/admin/teachers/get-all-teachers")

// Get all teachers with pagination
export const getTeachersPagination = (page = 0, size = 10) =>
	api.get("/admin/teachers/get-all-teachers-pagination", {
		params: { page, size },
	})

// Get single teacher by ID
export const getTeacher = (teacherId) =>
	api.get(`/admin/teachers/teacher/${teacherId}`)

// Get all teachers by status
export const getTeachersByStatus = (status) =>
	api.get("/admin/teachers/get-all-teachers-by-status", { params: { status } })

// Get all teachers by status with pagination
export const getTeachersByStatusPagination = (status, page = 0, size = 10) =>
	api.get("/admin/teachers/get-all-teachers-by-status-pagination", {
		params: { status, page, size },
	})

// ==================== POST ====================

// Add new teacher
export const addTeacher = (payload) =>
	api.post("/admin/teachers/add-teacher", payload)
