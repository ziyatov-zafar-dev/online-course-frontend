import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

const GoogleAuthHandler = () => {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	useEffect(() => {
		const accessToken = searchParams.get("accessToken")
		const refreshToken = searchParams.get("refreshToken")
		const email = searchParams.get("email")

		if (accessToken && refreshToken) {
			// Token va emailni saqlash (access_token formatda - boshqa joylar bilan mos)
			localStorage.setItem("access_token", accessToken)
			localStorage.setItem("refresh_token", refreshToken)
			if (email) {
				localStorage.setItem("userEmail", email)
			}

			// Dashboardga yo'naltirish
			toast.success("Google orqali muvaffaqiyatli avtorizatsiya qilindi!", {
				description: `Xush kelibsiz, ${email}!`,
			})
			navigate("/dashboard", { replace: true })
		} else {
			// Token yo'q bo'lsa signin ga qaytarish
			toast.error("Google avtorizatsiya muvaffaqiyatsiz tugadi")
			navigate("/signin", { replace: true })
		}
	}, [navigate, searchParams])

	return (
		<div className='flex items-center justify-center h-screen bg-gray-50'>
			<div className='text-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4'></div>
				<p className='text-gray-700 text-lg'>
					Google avtorizatsiya tekshirilmoqda...
				</p>
			</div>
		</div>
	)
}

export default GoogleAuthHandler
