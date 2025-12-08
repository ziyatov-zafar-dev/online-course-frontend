import ProtectedRoute from "@/components/ui/ProtectedRoute"
import DashboardLayout from "@/layouts/DashboardLayout"
import CategoriesList from "@/pages/admin/Categories/CategoriesList"
import CoursesList from "@/pages/admin/Courses/CoursesList"
import LessonsList from "@/pages/admin/Lessons/LessonsList"
import ModulesList from "@/pages/admin/Modules/ModulesList"
import SkillsList from "@/pages/admin/Skills/SkillsList"
import UsersList from "@/pages/admin/Users/UsersList"
import EmailVerify from "@/pages/auth/EmailVerify"
import PasswordReset from "@/pages/auth/PasswordReset"
import SignIn from "@/pages/auth/SignIn"
import SignUp from "@/pages/auth/SignUp"
import { BrowserRouter, Route, Routes } from "react-router-dom"

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/auth/sign-in' element={<SignIn />} />
				<Route path='/auth/sign-up' element={<SignUp />} />
				<Route path='/auth/verify-email' element={<EmailVerify />} />
				<Route path='/auth/reset-password' element={<PasswordReset />} />
				<Route element={<ProtectedRoute />}>
					<Route element={<DashboardLayout />}>
						<Route path='/admin/skills' element={<SkillsList />} />
						<Route path='/admin/modules' element={<ModulesList />} />
						<Route path='/admin/courses' element={<CoursesList />} />
						<Route path='/admin/categories' element={<CategoriesList />} />
						<Route path='/admin/users' element={<UsersList />} />
						<Route path='/admin/lessons' element={<LessonsList />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
