import api from "./index"

// ==================== GET ====================

// Get all categories (list - without pagination)
export const getCategories = () => api.get("/admin/categories/list")

// Get all categories with pagination
export const getCategoriesPagination = (page = 0, size = 10) =>
	api.get("/admin/categories/pagination", { params: { page, size } })

// Get single category by ID
export const getCategory = (categoryId) =>
	api.get(`/admin/categories/category/${categoryId}`)

// Get category by slug
export const getCategoryBySlug = (slug) =>
	api.get(`/admin/categories/slug/${slug}`)

// Check if slug exists
export const checkSlug = (slug) =>
	api.get("/admin/categories/slug/check", { params: { slug } })

// Search categories
export const searchCategories = (keyword) =>
	api.get("/admin/categories/search", { params: { kyw: keyword } })

// Search categories with pagination
export const searchCategoriesPagination = (keyword, page = 0, size = 10) =>
	api.get("/admin/categories/pagination/search", {
		params: { kyw: keyword, page, size },
	})

// Filter categories by status
export const getCategoriesByStatus = (status) =>
	api.get(`/admin/categories/filter-by-status/${status}`)

// Filter categories by status with pagination
export const getCategoriesByStatusPagination = (status, page = 0, size = 10) =>
	api.get(`/admin/categories/filter-by-status-pagination/${status}`, {
		params: { page, size },
	})

// Get soft-deleted categories
export const getSoftDeletedCategories = () =>
	api.get("/admin/categories/soft-deleted")

// Get soft-deleted categories with pagination
export const getSoftDeletedCategoriesPagination = (page = 0, size = 10) =>
	api.get("/admin/categories/pagination/soft-deleted", {
		params: { page, size },
	})

// Get all deleted categories
export const getDeletedCategories = () =>
	api.get("/admin/categories/deleted-categories")

// Get deleted categories with pagination
export const getDeletedCategoriesPagination = (page = 0, size = 10) =>
	api.get("/admin/categories/pagination/deleted-categories", {
		params: { page, size },
	})

// ==================== POST ====================

// Create category
export const createCategory = (payload) =>
	api.post("/admin/categories/add-category", payload)

// ==================== PUT ====================

// Update category
export const updateCategory = (categoryId, payload) =>
	api.put(`/admin/categories/update/${categoryId}`, payload)

// Change category status (OPEN/CLOSE)
export const changeCategoryStatus = (categoryId, status) =>
	api.put(`/admin/categories/${categoryId}/status`, null, {
		params: { status },
	})

// ==================== DELETE ====================

// Soft delete category
export const deleteCategory = (categoryId) =>
	api.delete(`/admin/categories/soft-delete-category/${categoryId}`)

// Hard delete category (permanent)
export const hardDeleteCategory = (categoryId) =>
	api.delete(`/admin/categories/delete-permanently-category/${categoryId}`)
