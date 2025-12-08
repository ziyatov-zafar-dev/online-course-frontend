import api from "./index"

// ==================== GET ====================

// Get lessons by module ID
export const getLessonsByModule = (moduleId) =>
	api.get(`/admin/lessons/lessons-by-module-id/${moduleId}`)

// Get lessons by module ID with pagination
export const getLessonsByModulePagination = (moduleId, page = 0, size = 10) =>
	api.get(`/admin/lessons/lessons-by-module-id/${moduleId}/pagination`, {
		params: { page, size },
	})

// Get single lesson by ID
export const getLesson = (lessonId) =>
	api.get(`/admin/lessons/lesson-by-id/${lessonId}`)

// Get lessons by module ID and status
export const getLessonsByStatus = (moduleId, status) =>
	api.get(`/admin/lessons/module/${moduleId}/status`, {
		params: { status },
	})

// Get lessons by module ID and status with pagination
export const getLessonsByStatusPagination = (
	moduleId,
	status,
	page = 0,
	size = 10
) =>
	api.get(`/admin/lessons/module/${moduleId}/status/paging`, {
		params: { status, arg2: page, arg3: size },
	})

// Get homework by ID
export const getHomework = (homeworkId) =>
	api.get(`/admin/lessons/get-homework-by-id/${homeworkId}`)

// ==================== POST ====================

// Add lesson to module
export const addLesson = (payload) =>
	api.post("/admin/lessons/add-lesson", payload)

// Upload video to lesson
export const uploadLessonVideo = (lessonId, videoFile) => {
	const formData = new FormData()
	formData.append("video", videoFile)
	return api.post(
		`/admin/lessons/upload-video-to-lesson/${lessonId}/video`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	)
}

// Create homework for lesson
export const createHomework = (
	lessonId,
	title,
	description,
	maxScore,
	minScore,
	files = []
) => {
	const formData = new FormData()
	files.forEach((file) => formData.append("files", file))

	return api.post("/admin/lessons/homework/create", formData, {
		params: { title, description, maxScore, minScore, lessonId },
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
}

// ==================== PUT ====================

// Update lesson
export const updateLesson = (lessonId, payload) =>
	api.put(`/admin/lessons/edit/${lessonId}`, payload)

// Change lesson order
export const changeLessonOrder = (lessonId, newOrderNumber) =>
	api.put(`/admin/lessons/${lessonId}/change-order/${newOrderNumber}`)

// Change homework min ball
export const changeHomeworkMinBall = (homeworkId, newMinBall) =>
	api.put(`/admin/lessons/${homeworkId}/min-ball/${newMinBall}`)

// Change homework max ball
export const changeHomeworkMaxBall = (homeworkId, newMaxBall) =>
	api.put(`/admin/lessons/${homeworkId}/max-ball/${newMaxBall}`)

// Update homework
export const updateHomework = (
	homeworkId,
	title,
	desc,
	maxScore,
	minScore,
	files = []
) => {
	const formData = new FormData()
	files.forEach((file) => formData.append("files", file))

	return api.put(`/admin/lessons/update-homework/${homeworkId}`, formData, {
		params: { title, desc, max_score: maxScore, min_score: minScore },
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
}

// ==================== DELETE ====================

// Soft delete lesson
export const deleteLesson = (lessonId) =>
	api.delete(`/admin/lessons/delete/soft/${lessonId}`)

// Hard delete lesson
export const hardDeleteLesson = (lessonId) =>
	api.delete(`/admin/lessons/delete/hard/${lessonId}`)

// ==================== Legacy endpoints for backwards compatibility ====================
export const getLessons = (params) => api.get("/admin/lessons", { params })
export const createLesson = (payload) => api.post("/admin/lessons", payload)
export const restoreLesson = (lessonId) =>
	api.post(`/admin/lessons/restore/${lessonId}`)
