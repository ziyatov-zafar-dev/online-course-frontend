import ForgotPassword from "@/pages/auth/ForgotPassword"
import ResetPassword from "@/pages/auth/ResetPassword"
import SignIn from "@/pages/auth/SignIn"
import SignUp from "@/pages/auth/SignUp"
import Dashboard from "@/pages/Dashboard"
import GoogleAuthHandler from "@/pages/GoogleAuthHandler"
import NotFound from "@/pages/NotFound"
import OtpIn from "@/pages/OtpIn"
import OtpUp from "@/pages/OtpUp"
// user
import ProfileForm from "@/pages/users/ProfileForm"
import ProfileImageUpload from "@/pages/users/ProfileImageUpload"
import { Navigate, Route, Routes } from "react-router-dom"

const AppRouter = () => {
	return (
		<Routes>
			<Route path='/' element={<Navigate to='/signin' replace />} />

			<Route path='/signin' element={<SignIn />} />
			<Route path='/signup' element={<SignUp />} />
			<Route path='/signin/verify' element={<OtpIn />} />
			<Route path='/signup/verify' element={<OtpUp />} />
			<Route path='/dashboard' element={<Dashboard />} />
			<Route path='/forgot-password' element={<ForgotPassword />} />
			<Route path='/reset-password' element={<ResetPassword />} />
			<Route path='/google-auth-success' element={<GoogleAuthHandler />} />

			{/* USER */}
			<Route
				path='/users/profile-image-upload'
				element={<ProfileImageUpload />}
			/>
			<Route path='/users/profile' element={<ProfileForm />} />

			{/* 404 PAGE */}
			<Route path='*' element={<NotFound />} />
		</Routes>
	)
}

export default AppRouter
