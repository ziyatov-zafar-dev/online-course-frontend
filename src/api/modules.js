import api from "./index"

// ==================== GET ====================

// Get all modules by course ID
export const getModulesByCourse = (courseId) =>
	api.get(`/admin/modules/get-all-modules-by-course-id/${courseId}`)

// Get modules by course ID with pagination
export const getModulesByCourseWithPagination = (
	courseId,
	page = 0,
	size = 10
) =>
	api.get(
		`/admin/modules/get-all-modules-by-course-id/${courseId}/pagination`,
		{
			params: { arg1: page, arg2: size },
		}
	)

// Get single module by ID
export const getModule = (moduleId) =>
	api.get(`/admin/modules/module/${moduleId}`)

// Get soft-deleted modules by course ID
export const getSoftDeletedModules = (courseId) =>
	api.get(`/admin/modules/soft-deleted/${courseId}`)

// Get soft-deleted modules by course ID with pagination
export const getSoftDeletedModulesWithPagination = (
	courseId,
	page = 0,
	size = 10
) =>
	api.get(`/admin/modules/soft-deleted/${courseId}/pagination`, {
		params: { page, size },
	})

// Get hard-deleted modules by course ID
export const getHardDeletedModules = (courseId) =>
	api.get(`/admin/modules/hard-deleted/${courseId}`)

// Get hard-deleted modules by course ID with pagination
export const getHardDeletedModulesWithPagination = (
	courseId,
	page = 0,
	size = 10
) =>
	api.get(`/admin/modules/hard-deleted/${courseId}/pagination`, {
		params: { page, size },
	})

// ==================== POST ====================

// Add new module to course
export const addModule = (payload) =>
	api.post("/admin/modules/add-module", payload)

// Restore soft-deleted module
export const restoreModule = (moduleId) =>
	api.post(`/admin/modules/restore/${moduleId}`)

// ==================== PUT ====================

// Update module
export const updateModule = (moduleId, payload) =>
	api.put(`/admin/modules/edit-module/${moduleId}`, payload)

// ==================== DELETE ====================

// Soft-delete module (marks as inactive)
export const deleteModule = (moduleId) =>
	api.delete(`/admin/modules/delete/${moduleId}`)

// Hard-delete module (permanently removes from database - IRREVERSIBLE!)
export const hardDeleteModule = (moduleId) =>
	api.delete(`/admin/modules/hard-delete/${moduleId}`)
