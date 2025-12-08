import api from "./index"

// ==================== GET ====================

// Get all courses
export const getCourses = () => api.get("/admin/courses/get-all-courses")

// Get all courses with pagination
export const getCoursesPagination = (page = 0, size = 10) =>
	api.get("/admin/courses/get-all-courses-pagination", {
		params: { page, size },
	})

// Get single course by ID
export const getCourse = (courseId) =>
	api.get(`/admin/courses/course/${courseId}`)

// Get courses by status
export const getCoursesByStatus = (status) =>
	api.get("/admin/courses/get-all-courses-by-status", { params: { status } })

// Get courses by status with pagination
export const getCoursesByStatusPagination = (status, page = 0, size = 10) =>
	api.get("/admin/courses/get-all-courses-by-status-pagination", {
		params: { status, page, size },
	})

// ==================== POST ====================

// Create course
export const createCourse = (payload) =>
	api.post("/admin/courses/add-course", payload)

// ==================== PUT ====================

// Update course
export const updateCourse = (courseId, payload) =>
	api.put(`/admin/courses/update-course/${courseId}`, payload)

// Update course pricing
export const updateCoursePricing = (courseId, payload) =>
	api.put(`/admin/courses/update-course-pricing/${courseId}`, payload)

// Change course status (OPEN/DRAFT/CLOSE)
export const changeCourseStatus = (courseId, status) =>
	api.put(`/admin/courses/change-course-status/${courseId}`, null, {
		params: { status },
	})

// Restore soft-deleted course
export const restoreCourse = (courseId) =>
	api.put(`/admin/courses/restore-course/${courseId}`)

// ==================== PATCH ====================

// Add course image
export const addCourseImage = (courseId, imageFile) => {
	const formData = new FormData()
	formData.append("image", imageFile)
	return api.patch(`/admin/courses/${courseId}/add-image`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
}

// Add course promo video
export const addCourseVideo = (courseId, videoFile) => {
	const formData = new FormData()
	formData.append("video", videoFile)
	return api.patch(`/admin/courses/${courseId}/add-video`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
}

// ==================== DELETE ====================

// Soft delete course
export const deleteCourse = (courseId) =>
	api.delete(`/admin/courses/soft-delete/${courseId}`)

// Hard delete course (permanent)
export const hardDeleteCourse = (courseId) =>
	api.delete(`/admin/courses/hard-delete/${courseId}`)

// ==================== PROMO CODE ====================

// Get promo code by ID
export const getPromoCode = (promoCodeId) =>
	api.get(`/admin/courses/promo-code/${promoCodeId}`)

// Get all promo codes
export const getAllPromoCodes = () =>
	api.get("/admin/courses/promo-code/get-all-promo-codes")

// Get all promo codes with pagination
export const getAllPromoCodesPagination = (page = 0, size = 10) =>
	api.get("/admin/courses/promo-code/get-all-promo-codes-pagination", {
		params: { page, size },
	})

// Get promo codes by course ID
export const getPromoCodesByCourse = (courseId) =>
	api.get(
		`/admin/courses/promo-code/get-all-promo-codes-by-course-id/${courseId}`
	)

// Get promo codes by course ID with pagination
export const getPromoCodesByCoursePagination = (
	courseId,
	page = 0,
	size = 10
) =>
	api.get(
		`/admin/courses/promo-code/get-all-promo-codes-by-course-id-pagination/${courseId}`,
		{ params: { page, size } }
	)

// Get promo codes by teacher ID
export const getPromoCodesByTeacher = (teacherId) =>
	api.get(
		`/admin/courses/promo-code/get-all-promo-codes-by-course-id/${teacherId}`
	)

// Get promo codes by teacher ID with pagination
export const getPromoCodesByTeacherPagination = (
	teacherId,
	page = 0,
	size = 10
) =>
	api.get(
		`/admin/courses/promo-code/get-all-promo-codes-by-course-id-pagination/${teacherId}`,
		{ params: { page, size } }
	)

// Check if promo code exists
export const checkPromoCodeExists = (code) =>
	api.get(`/admin/courses/promo-code/is-exists/${code}`)

// Find promo code by code string
export const findPromoCodeByCode = (code) =>
	api.get(`/admin/courses/promo-code/find-by-promo-code/${code}`)

// Add promo code to course
export const addPromoCodeToCourse = (courseId, payload) =>
	api.post(`/admin/courses/promo-code/add/${courseId}`, payload)
