import ForgotPassword from "@/pages/auth/ForgotPassword"
import ResetPassword from "@/pages/auth/ResetPassword"
import SignIn from "@/pages/auth/SignIn"
import SignUp from "@/pages/auth/SignUp"
import Dashboard from "@/pages/Dashboard"
import GoogleAuthHandler from "@/pages/GoogleAuthHandler"
import GoogleEmailNotFound from "@/pages/GoogleEmailNotFound"
import NotFound from "@/pages/NotFound"
import OtpIn from "@/pages/OtpIn"
import OtpUp from "@/pages/OtpUp"
import { Navigate, Route, Routes } from "react-router-dom"

// User pages
import ChangePasswordForm from "@/pages/user/ChangePasswordForm"
import ChangeUsernameForm from "@/pages/user/ChangeUsernameForm"
import ProfileForm from "@/pages/user/ProfileForm"
import ProfileImageUpload from "@/pages/user/ProfileImageUpload"
import ProfilMe from "@/pages/user/ProfilMe"
import RequestEmailCodeForm from "@/pages/user/RequestEmailCodeForm"
import VerifyEmailForm from "@/pages/user/VerifyEmailForm"

// Admin pages - Skills
import SkillCreate from "@/pages/admin/Skills/SkillCreate"
import SkillEdit from "@/pages/admin/Skills/SkillEdit"
import SkillsList from "@/pages/admin/Skills/SkillsList"

// Admin pages - Modules
import ModuleCreate from "@/pages/admin/Modules/ModuleCreate"
import ModuleEdit from "@/pages/admin/Modules/ModuleEdit"
import ModulesList from "@/pages/admin/Modules/ModulesList"

// Admin pages - Courses
import CourseCreate from "@/pages/admin/Courses/CourseCreate"
import CourseEdit from "@/pages/admin/Courses/CourseEdit"
import CoursesList from "@/pages/admin/Courses/CoursesList"

// Admin pages - Categories
import CategoriesList from "@/pages/admin/Categories/CategoriesList"
import CategoryCreate from "@/pages/admin/Categories/CategoryCreate"
import CategoryEdit from "@/pages/admin/Categories/CategoryEdit"

// Admin pages - Users
import UserEdit from "@/pages/admin/Users/UserEdit"
import UsersList from "@/pages/admin/Users/UsersList"

// Admin pages - Lessons
import LessonCreate from "@/pages/admin/Lessons/LessonCreate"
import LessonEdit from "@/pages/admin/Lessons/LessonEdit"
import LessonsList from "@/pages/admin/Lessons/LessonsList"

// Settings
import Settings from "@/pages/Settings"

// Layout
import DashboardLayout from "@/layouts/DashboardLayout"

// --- Protected & Public Route komponentlari ---
const ProtectedRoute = ({ children }) => {
	const token = localStorage.getItem("access_token") // access_token tekshiriladi
	if (!token) {
		return <Navigate to='/signin' replace />
	}
	return children
}

const PublicRoute = ({ children }) => {
	const token = localStorage.getItem("access_token")
	if (token) {
		return <Navigate to='/dashboard' replace />
	}
	return children
}

// --- App Router ---
const AppRouter = () => {
	return (
		<Routes>
			<Route path='/' element={<Navigate to='/signin' replace />} />

			{/* AUTH */}
			<Route
				path='/signin'
				element={
					<PublicRoute>
						<SignIn />
					</PublicRoute>
				}
			/>
			<Route
				path='/signup'
				element={
					<PublicRoute>
						<SignUp />
					</PublicRoute>
				}
			/>
			<Route
				path='/signin/verify'
				element={
					<PublicRoute>
						<OtpIn />
					</PublicRoute>
				}
			/>
			<Route
				path='/signup/verify'
				element={
					<PublicRoute>
						<OtpUp />
					</PublicRoute>
				}
			/>
			<Route path='/forgot-password' element={<ForgotPassword />} />
			<Route path='/reset-password' element={<ResetPassword />} />
			<Route path='/google-auth-success' element={<GoogleAuthHandler />} />
			<Route path='/google-email-not-found' element={<GoogleEmailNotFound />} />

			{/* DASHBOARD */}
			<Route
				path='/dashboard'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<Dashboard />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>

			{/* USER */}
			<Route
				path='/user/profile-image-upload'
				element={
					<ProtectedRoute>
						<ProfileImageUpload />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/user/profile'
				element={
					<ProtectedRoute>
						<ProfileForm />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/user/me'
				element={
					<ProtectedRoute>
						<ProfilMe />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/user/change-password'
				element={
					<ProtectedRoute>
						<ChangePasswordForm />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/user/change-username'
				element={
					<ProtectedRoute>
						<ChangeUsernameForm />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/user/request-change-email'
				element={
					<ProtectedRoute>
						<RequestEmailCodeForm />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/user/verify-change-email'
				element={
					<ProtectedRoute>
						<VerifyEmailForm />
					</ProtectedRoute>
				}
			/>

			{/* ADMIN ROUTES */}
			{/* Skills */}
			<Route
				path='/admin/skills'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<SkillsList />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin/skills/create'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<SkillCreate />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin/skills/edit/:id'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<SkillEdit />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>

			{/* Modules */}
			<Route
				path='/admin/modules'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<ModulesList />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin/modules/create'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<ModuleCreate />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin/modules/edit/:id'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<ModuleEdit />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>

			{/* Courses */}
			<Route
				path='/admin/courses'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<CoursesList />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin/courses/create'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<CourseCreate />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin/courses/edit/:id'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<CourseEdit />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>

			{/* Categories */}
			<Route
				path='/admin/categories'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<CategoriesList />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin/categories/create'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<CategoryCreate />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin/categories/edit/:id'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<CategoryEdit />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>

			{/* Users */}
			<Route
				path='/admin/users'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<UsersList />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin/users/edit/:id'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<UserEdit />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>

			{/* Lessons */}
			<Route
				path='/admin/lessons'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<LessonsList />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin/lessons/create'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<LessonCreate />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/admin/lessons/edit/:id'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<LessonEdit />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>

			{/* Settings */}
			<Route
				path='/settings'
				element={
					<ProtectedRoute>
						<DashboardLayout>
							<Settings />
						</DashboardLayout>
					</ProtectedRoute>
				}
			/>

			{/* 404 PAGE */}
			<Route path='*' element={<NotFound />} />
		</Routes>
	)
}

export default AppRouter
