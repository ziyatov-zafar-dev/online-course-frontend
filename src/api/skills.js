import api from "./index"

// ==================== GET ====================

// Get skills by course ID
export const getSkillsByCourse = (courseId) =>
	api.get(`/admin/skills/skills-by-course/${courseId}`)

// Get single skill by ID
export const getSkill = (skillId) => api.get(`/admin/skills/skill/${skillId}`)

// ==================== POST ====================

// Add skill to course (with file upload)
export const addSkillToCourse = (courseId, name, orderNumber, icon) => {
	const formData = new FormData()
	formData.append("icon", icon)

	return api.post("/admin/skills/add-skill-to-course", formData, {
		params: {
			courseId,
			name,
			orderNumber,
		},
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
}

// ==================== PUT ====================

// Edit skill (with file upload)
export const updateSkill = (skillId, skillName, orderNumber, icon) => {
	const formData = new FormData()
	formData.append("icon", icon)

	return api.put(`/admin/skills/edit/${skillId}`, formData, {
		params: {
			skill_name: skillName,
			order_number: orderNumber,
		},
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
}

// ==================== DELETE ====================

// Delete skill
export const deleteSkill = (skillId) =>
	api.delete(`/admin/skills/delete/${skillId}`)
